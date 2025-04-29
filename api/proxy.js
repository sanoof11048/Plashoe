// export default async function handler(req, res) {
//     const { method, headers, query } = req;
//     const path = query.path;
  
//     if (!path) {
//       return res.status(400).json({ error: "Missing 'path' query parameter." });
//     }
  
//     const targetUrl = `http://plashoe.runasp.net/api/${path}`;
//     console.log(`Proxying request to: ${targetUrl}`);
  
//     let bodyData;
//     if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
//       try {
//         bodyData = req.body;
//       } catch (err) {
//         return res.status(400).json({ error: "Invalid JSON body" });
//       }
//     }
  
//     try {
//       const backendRes = await fetch(targetUrl, {
//         method,
//         headers: {
//           "Content-Type": headers["content-type"] || "application/json",
//           Authorization: headers.authorization || "", // forward token if any
//         },
//         body: bodyData ? JSON.stringify(bodyData) : undefined,
//       });
  
//       // Capture backend response before reading
//       const contentType = backendRes.headers.get("Content-Type");
//       res.status(backendRes.status);
  
//       backendRes.headers.forEach((value, key) => {
//         res.setHeader(key, value);
//       });
  
//       if (contentType?.includes("application/json")) {
//         const json = await backendRes.json();
//         res.json(json);
//       } else if (contentType?.includes("text")) {
//         const text = await backendRes.text();
//         res.send(text);
//       } else if (contentType?.includes("application/octet-stream")) {
//         const buffer = await backendRes.arrayBuffer();
//         res.send(Buffer.from(buffer));
//       } else {
//         const fallback = await backendRes.text();
//         res.send(fallback);
//       }
//     } catch (error) {
//       console.error("Proxy error:", error);
//       res.status(500).json({ error: "Proxy error", details: error.message });
//     }
//   }
  

export default async function handler(req, res) {
    const { path } = req.query;
    const targetUrl = `http://plashoe.runasp.net/api/${path.join('/')}`;
  
    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      });
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch from API" });
    }
  }
  
