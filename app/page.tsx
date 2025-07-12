'use client'

import { useState, useEffect } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, Activity, Zap, Globe } from 'lucide-react'

export default function SimpleStyledPage() {
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const connection = new Connection('https://api.mainnet-beta.solana.com')

  const fetchBalance = async () => {
    if (!publicKey) return
    
    setLoading(true)
    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()
    }
  }, [connected, publicKey])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              Solana
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Hub
              </span>
            </h1>
            <p className="text-slate-300 text-lg">Your gateway to the Solana ecosystem</p>
          </div>
          <div className="flex items-center gap-4">
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !border-0 !rounded-lg !font-semibold !transition-all !duration-200" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Network</CardTitle>
              <Globe className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Mainnet</div>
              <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                Active
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Status</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Online</div>
              <p className="text-xs text-slate-400 mt-2">All systems operational</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">TPS</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2,847</div>
              <p className="text-xs text-slate-400 mt-2">Transactions per second</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Wallet</CardTitle>
              <Wallet className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {connected ? 'Connected' : 'Disconnected'}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {connected ? 'Ready to transact' : 'Connect your wallet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wallet Info */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-400" />
                Wallet Information
              </CardTitle>
              <CardDescription className="text-slate-400">
                View your wallet details and balance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connected && publicKey ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Public Key</label>
                    <div className="mt-1 p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                      <code className="text-sm text-slate-200 break-all">
                        {publicKey.toString()}
                      </code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Balance</label>
                    <div className="mt-1 p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                      <div className="text-2xl font-bold text-white">
                        {loading ? (
                          <div className="animate-pulse">Loading...</div>
                        ) : balance !== null ? (
                          `${balance.toFixed(4)} SOL`
                        ) : (
                          'Unable to fetch'
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={fetchBalance} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading ? 'Refreshing...' : 'Refresh Balance'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Connect your wallet to view details</p>
                  <p className="text-sm text-slate-500">
                    Use the wallet button in the top right to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Features
              </CardTitle>
              <CardDescription className="text-slate-400">
                Explore what you can do with Solana
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-600/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-200">Lightning-fast transactions</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-600/50">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-200">Low transaction fees</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-600/50">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-200">Decentralized applications</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-600/50">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-slate-200">NFT marketplace</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-200 hover:bg-slate-700"
              >
                Explore Ecosystem
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Built with ❤️ for the Solana community
          </p>
        </div>
      </div>
    </div>
  )
}