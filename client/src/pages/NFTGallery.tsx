import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Image, Zap, Star, Award, Plus, RefreshCw, ExternalLink, Sparkles } from "lucide-react";

const SAMPLE_NFTS = [
  { id:"1", name:"SkyGod #001", collection:"SkyGods", rarity:"Legendary", price:"2.5 ETH", image:"🏆", traits:[{trait:"Background",value:"Cosmic"},{trait:"Eyes",value:"Laser"},{trait:"Crown",value:"Diamond"}] },
  { id:"2", name:"CryptoSky #444", collection:"CryptoSkies", rarity:"Epic", price:"0.8 ETH", image:"🌌", traits:[{trait:"Sky",value:"Aurora"},{trait:"Stars",value:"Gold"},{trait:"Moon",value:"Blood"}] },
  { id:"3", name:"SkyBot #777", collection:"SkyBots", rarity:"Rare", price:"0.3 ETH", image:"🤖", traits:[{trait:"Body",value:"Chrome"},{trait:"Eyes",value:"Neon"},{trait:"Weapon",value:"Laser"}] },
  { id:"4", name:"SkyDragon #13", collection:"SkyDragons", rarity:"Mythic", price:"5.0 ETH", image:"🐉", traits:[{trait:"Element",value:"Lightning"},{trait:"Wings",value:"Crystal"},{trait:"Scale",value:"Void"}] },
  { id:"5", name:"SkyPunk #2049", collection:"SkyPunks", rarity:"Common", price:"0.05 ETH", image:"😎", traits:[{trait:"Hair",value:"Mohawk"},{trait:"Eyes",value:"3D"},{trait:"Mouth",value:"Pipe"}] },
  { id:"6", name:"SkyApe #888", collection:"SkyApes", rarity:"Rare", price:"1.2 ETH", image:"🦍", traits:[{trait:"Fur",value:"Golden"},{trait:"Hat",value:"Crown"},{trait:"Clothes",value:"Suit"}] },
];

const RARITY_COLORS: Record<string,string> = {
  "Common":"oklch(0.7 0.05 200)",
  "Rare":"oklch(0.72 0.22 295)",
  "Epic":"oklch(0.76 0.19 185)",
  "Legendary":"oklch(0.78 0.16 65)",
  "Mythic":"oklch(0.72 0.18 150)",
};

export default function NFTGallery() {
  const { isAuthenticated, user } = useAuth();
  const [selected, setSelected] = useState<typeof SAMPLE_NFTS[0]|null>(null);
  const [mintOpen, setMintOpen] = useState(false);
  const [mintForm, setMintForm] = useState({ name:"", description:"", walletAddress:"" });
  const [filter, setFilter] = useState("All");

  const ipfsMut = trpc.nftEngine.uploadToIPFS.useMutation();

  const mintMut = trpc.nftEngine.mintNFT.useMutation({
    onSuccess: () => {
      toast.success(`${mintForm.name} has been minted to your wallet.`);
      setMintOpen(false);
      setMintForm({ name:"", description:"", walletAddress:"" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleMint = async () => {
    if (!user || !mintForm.name) return;
    try {
      toast.loading("Uploading metadata to IPFS...");
      const ipfsResult = await ipfsMut.mutateAsync({
        name: mintForm.name,
        description: mintForm.description || "SkyChain NFT",
        imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${mintForm.name}`,
        attributes: [{ trait_type: "Platform", value: "SkyChain" }],
      });
      toast.dismiss();
      toast.loading("Minting NFT on-chain...");
      await mintMut.mutateAsync({
        creatorId: user.id,
        collectionId: "sky-collection",
        metadata: { name: mintForm.name, description: mintForm.description, image: ipfsResult.ipfsUrl },
        recipientAddress: mintForm.walletAddress || "0x000",
      });
      toast.dismiss();
      toast.success(`NFT minted! IPFS: ${ipfsResult.cid}`);
    } catch (e: any) {
      toast.dismiss();
      toast.error(e.message || "Mint failed");
    }
  };

  const achieveMut = trpc.nftEngine.mintAchievementNFT.useMutation({
    onSuccess: () => toast.success("Achievement NFT minted on-chain!"),
    onError: (e: any) => toast.error(e.message),
  });

  const rarities = ["All", "Common", "Rare", "Epic", "Legendary", "Mythic"];
  const filtered = filter === "All" ? SAMPLE_NFTS : SAMPLE_NFTS.filter(n => n.rarity === filter);

  return (
    <div className="min-h-screen">
      <PageHeader title="NFT Gallery" subtitle="Mint · Collect · Trade digital collectibles on SkyChain"/>
      <div className="container py-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label:"Total NFTs", value:"6,444", color:"text-purple-400" },
            { label:"Floor Price", value:"0.05 ETH", color:"text-cyan-400" },
            { label:"Volume (24h)", value:"12.4 ETH", color:"text-green-400" },
            { label:"Holders", value:"1,847", color:"text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="gallery">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="drops">Drops</TabsTrigger>
              <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
            </TabsList>
            {isAuthenticated && (
              <Button onClick={()=>setMintOpen(true)} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-sm">
                <Plus className="w-4 h-4 mr-1.5"/>Mint NFT
              </Button>
            )}
          </div>

          <TabsContent value="gallery">
            {/* Rarity Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {rarities.map(r => (
                <button key={r} onClick={()=>setFilter(r)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter===r?"bg-white/20":"bg-white/5 hover:bg-white/10"}`}
                  style={filter===r&&r!=="All"?{backgroundColor:`${RARITY_COLORS[r]}30`,color:RARITY_COLORS[r]}:{}}>
                  {r}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(nft => (
                <div key={nft.id} onClick={()=>setSelected(nft)}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 cursor-pointer hover:bg-white/8 hover:border-white/20 transition-all group">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-900/40 to-cyan-900/40 flex items-center justify-center text-5xl mb-3 group-hover:scale-105 transition-transform">
                    {nft.image}
                  </div>
                  <div className="font-bold text-sm truncate">{nft.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{nft.collection}</div>
                  <div className="flex items-center justify-between">
                    <Badge className="text-xs" style={{backgroundColor:`${RARITY_COLORS[nft.rarity]}20`,color:RARITY_COLORS[nft.rarity],border:`1px solid ${RARITY_COLORS[nft.rarity]}40`}}>
                      {nft.rarity}
                    </Badge>
                    <span className="text-xs font-mono text-cyan-400">{nft.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drops">
            <div className="rounded-xl bg-white/5 border border-white/10 p-8 text-center">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-3"/>
              <h3 className="font-bold text-lg mb-2">Upcoming Drops</h3>
              <p className="text-muted-foreground text-sm mb-4">Exclusive NFT drops from top creators on SkyChain</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
                {[
                  { name:"SkyGods Genesis", date:"June 25, 2026", supply:"444", price:"0.44 ETH", status:"Upcoming" },
                  { name:"CryptoSkies Vol.2", date:"July 1, 2026", supply:"1000", price:"0.1 ETH", status:"Upcoming" },
                ].map(drop => (
                  <div key={drop.name} className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{drop.name}</span>
                      <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">{drop.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Date: <span className="text-foreground">{drop.date}</span></div>
                      <div>Supply: <span className="text-foreground">{drop.supply}</span></div>
                      <div>Price: <span className="text-cyan-400 font-mono">{drop.price}</span></div>
                    </div>
                    <Button size="sm" className="mt-3 w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30">
                      Set Reminder
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-nfts">
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <Image className="w-12 h-12 text-purple-400/40 mx-auto mb-3"/>
                <p className="text-muted-foreground mb-4">Login to view your NFT collection</p>
                <Button asChild className="bg-purple-600 hover:bg-purple-500"><a href={getLoginUrl()}>Login</a></Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
                  <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3"/>
                  <h3 className="font-bold mb-2">Mint Achievement NFT</h3>
                  <p className="text-sm text-muted-foreground mb-4">Immortalize your platform achievements on-chain</p>
                  <Button onClick={()=>achieveMut.mutate({userId:user!.id,achievementType:"early_adopter",userAddress:"0x000..."})}
                    disabled={achieveMut.isPending} className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 border border-yellow-500/30">
                    {achieveMut.isPending?<RefreshCw className="w-4 h-4 animate-spin"/>:<><Award className="w-4 h-4 mr-1.5"/>Mint Early Adopter NFT</>}
                  </Button>
                </div>
                <p className="text-center text-muted-foreground text-sm">Your minted NFTs will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* NFT Detail Modal */}
      <Dialog open={!!selected} onOpenChange={()=>setSelected(null)}>
        <DialogContent className="bg-background/95 border-white/10 max-w-md">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-900/40 to-cyan-900/40 flex items-center justify-center text-8xl">
                {selected.image}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{selected.collection}</div>
                  <Badge style={{backgroundColor:`${RARITY_COLORS[selected.rarity]}20`,color:RARITY_COLORS[selected.rarity],border:`1px solid ${RARITY_COLORS[selected.rarity]}40`}}>
                    {selected.rarity}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Floor Price</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">{selected.price}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Traits</div>
                <div className="grid grid-cols-3 gap-2">
                  {selected.traits.map(t => (
                    <div key={t.trait} className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                      <div className="text-xs text-muted-foreground">{t.trait}</div>
                      <div className="text-xs font-bold mt-0.5">{t.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600">Buy Now</Button>
                <Button variant="outline" className="border-white/10"><ExternalLink className="w-4 h-4"/></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mint NFT Modal */}
      <Dialog open={mintOpen} onOpenChange={setMintOpen}>
        <DialogContent className="bg-background/95 border-white/10">
          <DialogHeader><DialogTitle>Mint New NFT</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">NFT Name</label>
              <Input value={mintForm.name} onChange={e=>setMintForm(p=>({...p,name:e.target.value}))}
                placeholder="My Awesome NFT" className="bg-white/5 border-white/10"/>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
              <Input value={mintForm.description} onChange={e=>setMintForm(p=>({...p,description:e.target.value}))}
                placeholder="Describe your NFT" className="bg-white/5 border-white/10"/>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Recipient Wallet Address</label>
              <Input value={mintForm.walletAddress} onChange={e=>setMintForm(p=>({...p,walletAddress:e.target.value}))}
                placeholder="0x..." className="bg-white/5 border-white/10 font-mono text-sm"/>
            </div>
            <Button onClick={handleMint} disabled={mintMut.isPending||ipfsMut.isPending||!mintForm.name}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
              {mintMut.isPending?<><RefreshCw className="w-4 h-4 mr-2 animate-spin"/>Minting...</>:<><Zap className="w-4 h-4 mr-2"/>Mint NFT</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
