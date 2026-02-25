import { spawn } from 'child_process';

const cloudflaredPath = "C:\\Antigravity Projects\\Website Creation for Mom\\cloudflared.exe";

function startTunnel() {
    console.log("Starting Cloudflare Tunnel for Port 4321...");
    const cf = spawn(cloudflaredPath, ['tunnel', '--url', 'http://127.0.0.1:4321'], { shell: true });

    cf.stderr.on('data', (data) => {
        const text = data.toString();
        const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
        if (match) {
            console.log("\n\n=== PUBLIC WEBSITE URL ===");
            console.log(match[0]);
            console.log("==============================\n");
        }
    });

    cf.on('close', (code) => {
        console.log(`Cloudflare tunnel crashed with code ${code}. Restarting in 5s...`);
        setTimeout(startTunnel, 5000);
    });
}

startTunnel();



