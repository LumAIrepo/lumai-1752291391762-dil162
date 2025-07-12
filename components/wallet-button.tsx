'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet, Copy, ExternalLink, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'

interface WalletButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}

export default function WalletButton({ 
  className = '',
  variant = 'default',
  size = 'default'
}: WalletButtonProps) {
  const { publicKey, wallet, disconnect, connecting, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = () => {
    setVisible(true)
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast.success('Wallet disconnected')
    } catch (error) {
      toast.error('Failed to disconnect wallet')
    }
  }

  const copyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString())
        toast.success('Address copied to clipboard')
      } catch (error) {
        toast.error('Failed to copy address')
      }
    }
  }

  const openExplorer = () => {
    if (publicKey) {
      window.open(`https://explorer.solana.com/address/${publicKey.toString()}`, '_blank')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!mounted) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        disabled
      >
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (!connected || !publicKey) {
    return (
      <Button
        onClick={handleConnect}
        disabled={connecting}
        variant={variant}
        size={size}
        className={className}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
        >
          {wallet?.adapter.icon && (
            <img 
              src={wallet.adapter.icon} 
              alt={wallet.adapter.name}
              className="w-4 h-4 mr-2 rounded-sm"
            />
          )}
          {formatAddress(publicKey.toString())}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">
          {wallet?.adapter.name}
        </div>
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          {formatAddress(publicKey.toString())}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openExplorer}>
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}