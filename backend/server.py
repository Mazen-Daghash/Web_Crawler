from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import urllib.robotparser
import re
from collections import Counter

app = Flask(__name__)
CORS(app)

def is_same_domain(base_url, test_url):
    return urlparse(base_url).netloc == urlparse(test_url).netloc

def check_robots_txt(url):
    try:
        rp = urllib.robotparser.RobotFileParser()
        parsed_url = urlparse(url)
        robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
        rp.set_url(robots_url)
        rp.read()
        return lambda u: rp.can_fetch("*", u)
    except Exception as e:
        print(f"[ERROR] Failed to parse robots.txt for {url}: {e}")
        return lambda u: True

def extract_keywords(text, num_keywords=5):
    words = re.findall(r'\b\w{4,}\b', text.lower())
    word_counts = Counter(words)
    return [word for word, _ in word_counts.most_common(num_keywords)]

def crawl(url, depth=2):
    visited = set()
    results = []
    max_pages = 100
    can_fetch = check_robots_txt(url)

    def crawl_recursive(current_url, current_depth):
        if current_depth > depth or current_url in visited or len(visited) >= max_pages:
            return
        if not can_fetch(current_url):
            print(f"[INFO] Skipping {current_url}: Disallowed by robots.txt")
            return
        try:
            res = requests.get(current_url, timeout=5)
            if res.status_code != 200:
                return
            visited.add(current_url)
            soup = BeautifulSoup(res.text, 'html.parser')
            text = soup.get_text()
            title = soup.title.string.strip() if soup.title else 'No Title'
            description = ''
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc and meta_desc.get('content'):
                description = meta_desc['content'].strip()
            keywords = extract_keywords(text)
            results.append({
                'url': current_url,
                'title': title,
                'description': description,
                'keywords': keywords,
                'depth': current_depth
            })
            for link in soup.find_all('a', href=True):
                href = urljoin(current_url, link['href'])
                if is_same_domain(url, href):
                    crawl_recursive(href, current_depth + 1)
        except Exception as e:
            print(f"[ERROR] {current_url}: {e}")

    crawl_recursive(url, 1)
    return results

@app.route('/api/crawl', methods=['POST'])
def api_crawl():
    data = request.get_json()
    url = data.get('url')
    depth = int(data.get('depth', 2))
    if not url:
        return jsonify({'error': 'Missing URL'}), 400
    try:
        result = crawl(url, depth)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=9000)