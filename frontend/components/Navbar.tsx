"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletModal } from "@/components/WalletModal"
import { useEvmWallet } from "@/hooks/useEvmWallet"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const { isConnected, formatAddress } = useEvmWallet()

  const navItems = [
    { href: "/upload", label: "Upload" },
    { href: "/models", label: "Models" },
    { href: "/about", label: "About" },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                <img src="/logosmall.png" alt="Synapse Model logo" className="w-6 h-6 object-contain" loading="lazy" />
              </div>
              <span className="font-semibold text-lg text-foreground">Synapse Model</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}

              {/* Wallet Connection */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={isConnected ? "secondary" : "default"}
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center space-x-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isConnected ? formatAddress() : "Connect Wallet"}</span>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
              <div className="md:hidden py-4 border-t border-border">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={isConnected ? "secondary" : "default"}
                      onClick={() => setShowWalletModal(true)}
                      className="flex items-center space-x-2"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>{isConnected ? formatAddress() : "Connect Wallet"}</span>
                    </Button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </nav>

      <WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </>
  )
}
