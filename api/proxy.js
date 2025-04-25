export default async function handler(req, res) {
    const url = 'http://plashoe.runasp.net/api' + req.url;
  
    try {
      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          ...(req.headers.authorization && {
            Authorization: req.headers.authorization,
          })
        },
        body: req.method === 'GET' ? null : JSON.stringify(req.body),
      });
  
      const data = await response.json(); // use .json() if backend is returning JSON
      res.status(response.status).json(data); // return the response as JSON
    } catch (error) {
      res.status(500).json({ message: 'Proxy error', error: error.message });
    }
  }
  
