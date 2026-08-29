"use client";

import { useState } from "react";
import styles from "./NetworkLab.module.css";

interface PacketHop {
  node: string;
  ip: string;
  latency: string;
  status: "OK" | "DNS Resolved" | "TLS Handshake" | "200 OK";
}

export default function NetworkLab() {
  const [protocol, setProtocol] = useState<"HTTPS" | "HTTP/3 QUIC">("HTTP/3 QUIC");
  const [isSending, setIsSending] = useState(false);
  const [hops, setHops] = useState<PacketHop[]>([]);

  const handleSendPacket = () => {
    setIsSending(true);
    setHops([]);

    const sequence: PacketHop[] = [
      { node: "Client Laptop", ip: "192.168.1.105", latency: "0ms", status: "OK" },
      { node: "Gateway Wi-Fi Router", ip: "192.168.1.1", latency: "2ms", status: "OK" },
      { node: "ISP Recursive DNS (1.1.1.1)", ip: "1.1.1.1", latency: "14ms", status: "DNS Resolved" },
      { node: "Edge Cloudflare PoP (Jakarta)", ip: "104.18.22.45", latency: protocol === "HTTP/3 QUIC" ? "22ms" : "48ms", status: "TLS Handshake" },
      { node: "Origin Web Server", ip: "76.76.21.21", latency: protocol === "HTTP/3 QUIC" ? "68ms" : "112ms", status: "200 OK" },
    ];

    sequence.forEach((hop, i) => {
      setTimeout(() => {
        setHops((prev) => [...prev, hop]);
        if (i === sequence.length - 1) {
          setIsSending(false);
        }
      }, (i + 1) * 350);
    });
  };

  return (
    <div className={styles.labCard} id="network-packet-lab">
      <div className={styles.labHeader}>
        <div>
          <span className={styles.labTag}>Network Simulator</span>
          <h3 className={styles.labTitle}>Packet Routing &amp; Latency Tracer</h3>
        </div>
        <div className={styles.controls}>
          <div className={styles.protoSwitch}>
            <button
              className={`${styles.protoBtn} ${protocol === "HTTPS" ? styles.protoActive : ""}`}
              onClick={() => setProtocol("HTTPS")}
            >
              TCP TLS 1.3
            </button>
            <button
              className={`${styles.protoBtn} ${protocol === "HTTP/3 QUIC" ? styles.protoActive : ""}`}
              onClick={() => setProtocol("HTTP/3 QUIC")}
            >
              HTTP/3 QUIC
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSendPacket}
            disabled={isSending}
            id="send-test-packet-btn"
          >
            {isSending ? "Routing Packet..." : "Transmit Packet"}
          </button>
        </div>
      </div>

      <div className={styles.visualTopology}>
        <div className={styles.nodesRow}>
          {["Client", "Router", "DNS", "Edge CDN", "Origin"].map((name, i) => {
            const hasReached = hops.length > i;
            return (
              <div key={name} className={styles.nodeWrapper}>
                <div className={`${styles.nodeCircle} ${hasReached ? styles.nodeActive : ""}`}>
                  {i === 0 && "💻"}
                  {i === 1 && "📡"}
                  {i === 2 && "🔍"}
                  {i === 3 && "⚡"}
                  {i === 4 && "🗄️"}
                </div>
                <span className={styles.nodeName}>{name}</span>
                {i < 4 && (
                  <div className={`${styles.nodeConnector} ${hops.length > i + 1 ? styles.connectorActive : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Packet Hop Log Table */}
        <div className={styles.hopLog}>
          <div className={styles.hopLogHeader}>
            <span>Node Address</span>
            <span>Latency</span>
            <span>Protocol State</span>
          </div>
          <div className={styles.hopList}>
            {hops.length === 0 ? (
              <div className={styles.emptyLog}>Click &quot;Transmit Packet&quot; to trace the multi-hop routing journey.</div>
            ) : (
              hops.map((hop, i) => (
                <div key={i} className={styles.hopRow}>
                  <div className={styles.hopNode}>
                    <strong>{hop.node}</strong>
                    <span className={styles.hopIp}>{hop.ip}</span>
                  </div>
                  <span className={styles.hopLatency}>+{hop.latency}</span>
                  <span className={styles.hopStatus}>{hop.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
