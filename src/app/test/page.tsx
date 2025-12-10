export default function TestPage() {
    return (
        <div style={{ padding: "2rem", fontFamily: "monospace" }}>
            <h1>Test Page</h1>
            <p>If you can see this, the app is working!</p>
            <ul>
                <li>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"}</li>
                <li>DATABASE_URL: {process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"}</li>
            </ul>
        </div>
    );
}



