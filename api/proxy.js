export default async function handler(req, res) {
    const { method, body, headers, query } = req;
    const path = query.path;

    if (!path) {
        return res.status(400).json({ error: "Missing 'path' query parameter." });
    }

    const targetUrl = `http://plashoe.runasp.net/api/${path}`;
    console.log(`Proxying request to: ${targetUrl}`);

    try {
        const backendRes = await fetch(targetUrl, {
            method,
            headers: {
                "Content-Type": headers["content-type"] || "application/json",
                Authorization: headers.authorization || "",  // Forward the Authorization header if available
            },
            body: ["POST", "PUT", "PATCH", "DELETE"].includes(method)
                ? JSON.stringify(body)  // Include body only for methods that require it
                : undefined,
        });
        console.log("Backend status:", backendRes.status);

        console.log('Backend response body:', await backendRes.text());  // Log backend response body

        res.status(backendRes.status);
        for (const [key, value] of backendRes.headers.entries()) {
            res.setHeader(key, value);  // Forward all headers from backend
        }

        const contentType = backendRes.headers.get('Content-Type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await backendRes.json();
            console.log('Backend response body:', data); // ✅ Log the parsed JSON, not the raw stream
            res.json(data);
            return;
        } else if (contentType && contentType.includes('text')) {
            data = await backendRes.text();
            console.log('Backend response body:', data); // ✅ Log once
            res.send(data);
            return;
        } else if (contentType && contentType.includes('application/octet-stream')) {
            const buffer = await backendRes.arrayBuffer();
            res.send(Buffer.from(buffer));
            return;
        } else {
            data = await backendRes.text();
            console.log('Backend response body:', data);
            res.send(data);
            return;
        }
         // Send the response data back to the client

    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Proxy error", details: error.message });
    }
}
