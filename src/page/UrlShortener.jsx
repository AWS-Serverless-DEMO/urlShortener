import React, { useState } from 'react';

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch(`${API_ENDPOINT}/create-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: longUrl })
      });

      if (!response.ok) {
        throw new Error('URL 단축에 실패했습니다');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = () => {
    if (shortUrl) {
      window.open(`${API_ENDPOINT}/redirect-url/${shortUrl}`, '_blank');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">URL 단축 서비스</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-1">
            원본 URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '처리중...' : 'URL 단축하기'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="mt-8 p-4 bg-green-50 rounded">
          <h2 className="text-lg font-semibold mb-2">단축된 URL</h2>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-white border rounded">
              {shortUrl}
            </code>
            <button
              onClick={handleRedirect}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              이동하기
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <h3 className="font-medium mb-2">사용 방법:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>원본 URL을 입력합니다.</li>
          <li>단축하기 버튼을 클릭합니다.</li>
          <li>생성된 단축 URL을 복사하거나 이동하기 버튼을 클릭합니다.</li>
        </ol>
      </div>
    </div>
  );
};

export default UrlShortener;