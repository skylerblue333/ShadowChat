import React, { useEffect, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function MemoryGraphVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: graph, isLoading } = trpc.enterprise.memoryGraph.snapshot.useQuery();
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !graph) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Simple force-directed graph visualization
    const nodes = (graph as any)?.nodes || [];
    const links = (graph as any)?.links || [];

    // Initialize positions if not set
    nodes.forEach((node: any, i: number) => {
      if (!node.x) node.x = Math.random() * canvas.width;
      if (!node.y) node.y = Math.random() * canvas.height;
      if (!node.vx) node.vx = 0;
      if (!node.vy) node.vy = 0;
    });

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply forces
      nodes.forEach((node: any) => {
        node.vx *= 0.99;
        node.vy *= 0.99;
        node.x += node.vx;
        node.y += node.vy;

        // Bounds checking
        if (node.x < 0) node.x = 0;
        if (node.x > canvas.width) node.x = canvas.width;
        if (node.y < 0) node.y = 0;
        if (node.y > canvas.height) node.y = canvas.height;
      });

      // Draw links
      ctx.strokeStyle = '#444444';
      ctx.lineWidth = 1;
      ((graph as any)?.links || []).forEach((link: any) => {
        const source = nodes[link.source];
        const target = nodes[link.target];
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      (nodes as any[]).forEach((node: any) => {
        const size = node.size || 8;
        ctx.fillStyle = node.color || '#00ff88';
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText(node.label || '', node.x + size + 5, node.y);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [graph]);

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">MEMORY CONSTELLATION</h1>
          <p className="text-gray-400">Your life as a star map — every memory, skill, and connection</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Canvas */}
          <div className="col-span-2">
            <Card className="bg-gray-900 border-gray-800 p-4 h-[600px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full bg-black rounded cursor-pointer"
                onClick={(e) => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    // Find clicked node
                    (graph as any)?.nodes?.forEach((node: any) => {
                      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
                      if (dist < (node.size || 8) + 5) {
                        setSelectedNode(node);
                      }
                    });
                  }
                }}
              />
            </Card>
          </div>

          {/* Info Panel */}
          <div>
            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-4">MEMORY STATS</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Memories</p>
                  <p className="text-2xl font-bold text-cyan-400">{(graph as any)?.nodes?.length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Connections</p>
                  <p className="text-2xl font-bold text-purple-400">{(graph as any)?.links?.length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Knowledge Clusters</p>
                  <p className="text-2xl font-bold text-yellow-400">{(graph as any)?.clusters?.length || 0}</p>
                </div>
              </div>

              {selectedNode && (
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <h4 className="font-bold mb-4">{selectedNode.label}</h4>
                  <p className="text-sm text-gray-400 mb-4">{selectedNode.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Type: {selectedNode.type}</p>
                    <p className="text-xs text-gray-500">Strength: {selectedNode.strength}%</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
