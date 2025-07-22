import { useState, useEffect } from 'react';
import './CrawlerApp.css';

export default function CrawlerApp() {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(2);
  const [results, setResults] = useState([]);
  const [progressLog, setProgressLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('crawlHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('crawlHistory', JSON.stringify(history));
  }, [history]);

  const handleCrawl = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setResults([]);
    setError('');
    setProgressLog([`Starting crawl: ${url} at depth ${depth}`]);

    try {
      const res = await fetch('http://localhost:9000/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, depth }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResults(data);
      setProgressLog(prev => [...prev, `Crawl complete: ${data.length} pages found`]);
      setHistory(prev => {
        const newHistory = [{ url, timestamp: new Date().toISOString(), count: data.length }, ...prev.slice(0, 9)];
        return newHistory;
      });
    } catch (err) {
      setError(err.message);
      setProgressLog(prev => [...prev, `Error: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('crawlHistory');
  };

  const exportToCSV = () => {
    const headers = ['URL', 'Title', 'Description', 'Keywords', 'Depth'];
    const csvRows = [
      headers.join(','),
      ...results.map(item => `"${item.url.replace(/"/g, '""')}","${(item.title || 'Untitled Page').replace(/"/g, '""')}","${(item.description || '').replace(/"/g, '""')}","${(item.keywords || []).join(';').replace(/"/g, '""')}","${item.depth}"`)
    ];
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crawl_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crawl_results.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

  const handleHistoryClick = (historyUrl) => {
    setUrl(historyUrl);
    handleCrawl();
  };

  return (
    <div className="app-container">
      <div className="crawler-container">
        <h1 className="crawler-title">🕷️ Web Crawler</h1>

        <div className="crawler-input-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="crawler-input"
            onKeyPress={(e) => e.key === 'Enter' && handleCrawl()}
          />
          <select
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="crawler-input"
          >
            <option value="1">Depth: 1</option>
            <option value="2">Depth: 2</option>
            <option value="3">Depth: 3</option>
            <option value="4">Depth: 4</option>
            <option value="5">Depth: 5</option>
            <option value="6">Depth: 6</option>
          </select>
          <button
            onClick={handleCrawl}
            disabled={loading || !url}
            className={`crawler-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Crawling...
              </>
            ) : (
              '🔍 Start Crawling'
            )}
          </button>
        </div>

        {error && (
          <div className="crawler-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="crawler-progress-bar">
            <div className="crawler-progress"></div>
          </div>
        )}

        {progressLog.length > 0 && (
          <div className="crawler-progress-log">
            <h3>Crawl Progress</h3>
            {progressLog.map((log, i) => (
              <div key={i} className="progress-log-item">{log}</div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="crawler-history">
            <h3>Recent Crawls</h3>
            <button onClick={clearHistory} className="crawler-button crawler-clear-button">
              Clear History
            </button>
            {history.map((item, i) => (
              <div
                key={i}
                className="crawler-history-item"
                onClick={() => handleHistoryClick(item.url)}
              >
                <div>{item.url}</div>
                <div className="crawler-history-meta">
                  {new Date(item.timestamp).toLocaleString()} ({item.count} pages)
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="results-container">
          {results.length > 0 && (
            <div className="crawler-results-header">
              <h3>Results ({results.length} pages found)</h3>
              <div className="crawler-export-buttons">
                <button onClick={exportToCSV} className="crawler-button">
                  📥 Export to CSV
                </button>
                <button onClick={exportToJSON} className="crawler-button">
                  📥 Export to JSON
                </button>
              </div>
            </div>
          )}
          {results.length > 0 ? (
            <div className="crawler-results">
              {results.map((item, i) => (
                <div key={i} className="crawler-card" onClick={(e) => handleLinkClick(e, item.url)}>
                  <div className="crawler-url">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      🔗 {item.url} (Depth: {item.depth})
                    </a>
                  </div>
                  <div className="crawler-card-title">{item.title || 'Untitled Page'}</div>
                  <div className="crawler-desc">
                    {item.description || 'Page has been successfully crawled'}
                  </div>
                  {item.keywords && item.keywords.length > 0 && (
                    <div className="crawler-keywords">
                      <strong>Keywords:</strong> {item.keywords.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="crawler-empty">
                {url ? 'No results found. Try a different URL.' : 'Enter a website URL to begin crawling.'}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}