"use client";

export default function XSSTest() {
    const runXSS = () => {
        const payload = document.getElementById("xssInput").value;

        try {
            // Extract JS inside <script> tags
            const scriptContent = payload.replace(/<\/?script>/gi, "");

            // Execute only the JS part
            eval(scriptContent);
        } catch (err) {
            console.error("XSS test error:", err);
        }

        // Render visible HTML
        document.getElementById("xssOutput").innerHTML = payload;
    };


    return (
        <div style={{ padding: 20 }}>
            <h2>XSS Testing Sandbox</h2>

            <textarea
                id="xssInput"
                placeholder="Enter XSS payload here"
                style={{ width: "100%", height: "120px", marginBottom: "20px" }}
            />

            <button onClick={runXSS}>Run</button>

            <h3>Rendered Output:</h3>
            <div
                id="xssOutput"
                style={{ border: "1px solid #aaa", padding: 20, minHeight: 100 }}
            ></div>
        </div>
    );
}
