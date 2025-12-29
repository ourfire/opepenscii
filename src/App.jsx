import React, { useState, useEffect } from 'react';
import { Wallet, ExternalLink, Twitter, MessageCircle } from 'lucide-react';
import {ethers} from 'ethers';
import ABI from './abi.json';

export default function OpepensciiLanding() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [mintAmount, setMintAmount] = useState(1);
  const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/d9f25ac9b06a46e4a546e8dca688a7b9");
  const CONTRACT_ADDRESS = "0x1B52D008d60D0D2aeE831eE935199cb98fd43E78";
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
  const MAX_MINT_PER_TX = 100;
  const [minted, setMinted] = useState("0");
  const remaining =  10000 - parseInt(minted);
  const percentMinted = (parseInt(minted) / 10000) * 100;
  const maxMintAllowed = Math.min(100, remaining);
  const [isMinting, setIsMinting] = useState(false);


const getSigner = async () => {
  if (!window.ethereum) {
    alert('Please install MetaMask');
    return null;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
};

const getWriteContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};


const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet');
    }
};

const handleMint = async () => {
  if (!isConnected || isMinting) return;

  try {
    setIsMinting(true);

    const writeContract = await getWriteContract();

    const PRICE_PER_NFT = ethers.parseEther("0.004");
    const totalValue = PRICE_PER_NFT * BigInt(mintAmount);

    const tx = await writeContract.mint(
      mintAmount,
      { value: totalValue }
    );

    console.log("Tx sent:", tx.hash);

    await tx.wait();

    alert("Mint successful");

  } catch (err) {
    console.error(err);
    alert(err.reason || err.message || "Mint failed");
  } finally {
    setIsMinting(false);
  }
};




const getSupply = async () => {
    const totalSupply = await contract.totalSupply();
    return totalSupply;
  }

  useEffect(() => {
    const fetchSupply = async () => {
      const supply = await getSupply();
      setMinted(supply.toString());
    };
    fetchSupply();
  }, []);
 

  const collections = [
    { 
      topColor: '#00ff00',
      windowColor: '#FCE74C',
      starColor: '#7f766d',
      name: 'Green Edition'
    },
    { 
      topColor: '#ff00ff',
      windowColor: '#ff69b4',
      starColor: '#ffd700',
      name: 'Pink Edition'
    },
    { 
      topColor: '#FFD700',
      windowColor: '#ff8c00',
      starColor: '#ff4500',
      name: 'Gold Edition'
    },
    { 
      topColor: '#00ffff',
      windowColor: '#FCE74C',
      starColor: '#7f766d',
      name: 'Cyan Edition'
    },
    { 
      topColor: '#9d00ff',
      windowColor: '#00ffff',
      starColor: '#ff00ff',
      name: 'Purple Edition'
    },
    { 
      topColor: '#ff1744',
      windowColor: '#ffeb3b',
      starColor: '#00e676',
      name: 'Neon Edition'
    },
    { 
      topColor: '#00bcd4',
      windowColor: '#ff9800',
      starColor: '#e91e63',
      name: 'Sunset Edition'
    },
    { 
      topColor: '#76ff03',
      windowColor: '#ff6e40',
      starColor: '#00e5ff',
      name: 'Electric Edition'
    },
    { 
      topColor: '#ffffff',
      windowColor: '#cccccc',
      starColor: '#888888',
      name: 'Monochrome Edition'
    },
    { 
      topColor: '#ff006e',
      windowColor: '#8338ec',
      starColor: '#3a86ff',
      name: 'Vibrant Edition'
    },
    { 
      topColor: '#06ffa5',
      windowColor: '#fffb00',
      starColor: '#ff006e',
      name: 'Retro Edition'
    },
    { 
      topColor: '#f72585',
      windowColor: '#4cc9f0',
      starColor: '#7209b7',
      name: 'Vaporwave Edition'
    },
    { 
      topColor: '#ff9e00',
      windowColor: '#ff0099',
      starColor: '#00ffff',
      name: 'Miami Edition'
    },
    { 
      topColor: '#39ff14',
      windowColor: '#fe019a',
      starColor: '#00d4ff',
      name: 'Neon Nights Edition'
    },
    { 
      topColor: '#00ff41',
      windowColor: '#00b8ff',
      starColor: '#ff00de',
      name: 'Matrix Edition'
    },
    { 
      topColor: '#ffd700',
      windowColor: '#ff1493',
      starColor: '#00ced1',
      name: 'Royal Edition'
    },
  ];

  const AsciiArtSVG = ({ topColor, windowColor, starColor, animate = false }) => (
  <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="320" fill="#121212"/>
      <text 
          x="160" 
          y="155" 
          font-family="Arial, sans-serif" 
          font-weight="bold" 
          font-size="40" 
          text-anchor="middle"
      >
        <tspan x="164" dy="0" fill={topColor}>◵◵</tspan>
        <tspan x="152" dy="28" fill={windowColor}>⊞</tspan>
        <tspan x="176" dy="0" fill={windowColor}>⊞</tspan>
        <tspan x="190" dy="-35" fill={starColor}>*</tspan>
      </text>
  </svg>
  );
  return (
    <div className="min-h-screen bg-black text-white">
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 60s linear infinite;
          }
        `}
      </style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider">
            OPEPENSCII
          </div>
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 font-semibold hover:scale-105"
          >
            <Wallet size={20} />
            {isConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'CONNECT'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Infinite Carousel Background */}
        <div className="absolute inset-0 flex items-center overflow-hidden opacity-20">
          <div className="flex animate-scroll">
            {[...collections, ...collections].map((item, idx) => (
              <div key={idx} className="w-[640px] h-[640px] flex-shrink-0 mx-8">
                <AsciiArtSVG 
                  topColor={item.topColor}
                  windowColor={item.windowColor}
                  starColor={item.starColor}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-bold mb-6 tracking-tight">
            OPEPENSCII
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            ASCII art meets blockchain. A collection of unique, algorithmically generated NFTs 
            that blend retro aesthetics with modern technology.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
  
           <a href="#mint"
              className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              MINT NOW
            </a>

            <a href="#collection"
              className="px-10 py-4 bg-transparent border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
            >
              EXPLORE
            </a>
           </div>
        </div>
      </section>

      {/* Collection Preview */}
      <section id="collection" className="py-24 px-6 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 tracking-tight">
            Featured Collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:-rotate-1"
              >
                <div className="relative z-10">
                  <div className="h-64 mb-6 overflow-hidden bg-[#121212] transform group-hover:scale-105 transition-transform duration-500">                    <AsciiArtSVG 
                      topColor={item.topColor}
                      windowColor={item.windowColor}
                      starColor={item.starColor}
                      animate={false}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">This ASCII art may or may not be notable</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-sm text-gray-600">Edition</span>
                    <span className="font-bold text-white">#{String(idx + 1).padStart(4, '0')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mint Section */}
      <section id="mint" className="py-24 px-6 relative border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">
              Mint Your Opepenscii
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-black/50 rounded-2xl p-6 border border-white/10">
                <span className="text-lg text-gray-400">Price</span>
                <span className="text-2xl font-bold">0.004 ETH</span>
              </div>
              
              <div className="flex items-center justify-between bg-black/50 rounded-2xl p-6 border border-white/10">
                <span className="text-lg text-gray-400">Remaining</span>
                <span className="text-2xl font-bold">{remaining}</span>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-6 border border-white/10">
                <label className="block text-lg text-gray-400 mb-4">How many would you like to mint?</label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                    disabled={remaining === 0}
                    className="w-14 h-14 rounded-full border-2 border-white/20 hover:border-white hover:bg-white/10 transition-all font-bold text-2xl"
                  >
                    -
                  </button>
                    <input
                      type="number"
                      min="1"
                      max={maxMintAllowed}
                      value={mintAmount}
                      onChange={(e) =>
                        setMintAmount(
                          Math.min(
                            maxMintAllowed,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                    className="w-32 text-4xl font-bold text-center bg-transparent border-2 border-white/20 rounded-2xl py-3 focus:outline-none focus:border-white transition-all"
                  />
                <button
                  onClick={() =>
                    setMintAmount(Math.min(maxMintAllowed, mintAmount + 1))
                  }
                  disabled={remaining === 0}
                  className="w-14 h-14 rounded-full border-2 border-white/20 hover:border-white hover:bg-white/10 transition-all font-bold text-2xl"
                >
                  +
                </button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">Maximum 100 per transaction</p>
              </div>
              
              <button
                onClick={handleMint}
                className="w-full py-6 bg-white text-black rounded-2xl font-bold text-xl hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!isConnected || isMinting || remaining === 0}
              >
                {isConnected ? `MINT ${mintAmount} FOR ${(mintAmount * 0.004).toFixed(3)} ETH` : 'CONNECT WALLET TO MINT'}
              {isMinting
              ? "Minting..."
              : `Mint ${mintAmount} for ${(mintAmount * 0.004).toFixed(3)} ETH`}
              </button>
              
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${percentMinted}%` }} />
              </div>
              <p className="text-center text-sm text-gray-500">{minted} / 10000 minted</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 relative border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
            About Opepenscii
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-16 font-light">
            Opepenscii is a unique NFT collection that celebrates the art of ASCII. 
            Each piece is algorithmically generated, creating a one-of-a-kind digital artifact 
            that exists at the intersection of nostalgia and innovation. This ASCII art may or may not be notable.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">Unique Art</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Every Opepenscii is algorithmically generated and unique</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="text-5xl mb-4">⛓️</div>
              <h3 className="text-xl font-bold mb-3">On-Chain</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Fully stored on the Ethereum blockchain forever</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Join a vibrant community of ASCII art enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-wider">
              OPEPENSCII
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <MessageCircle size={24} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <ExternalLink size={24} />
              </a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2025 Opepenscii. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}