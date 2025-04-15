"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Listing } from "@/hooks/useMarketplace";
import { formatCurrency } from "@/lib/utils";

interface OfferFormProps {
  listing: Listing;
  onSubmit: (listingId: string, offerAmount: number, message?: string) => Promise<void>;
  isLoading: boolean;
}

export function OfferForm({ listing, onSubmit, isLoading }: OfferFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [offerAmount, setOfferAmount] = useState(listing.price * 0.9); // Default to 90% of listing price
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(listing.id, offerAmount, message);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Submit your offer for {listing.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <h4 className="font-medium">{listing.title}</h4>
              <p className="text-sm text-muted-foreground">
                Listed for {formatCurrency(listing.price)}
              </p>
            </div>
            {listing.images && listing.images.length > 0 && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="h-16 w-16 rounded object-cover"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerAmount">Your Offer Amount *</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <Input
                id="offerAmount"
                type="number"
                min="0"
                step="0.01"
                value={offerAmount}
                onChange={(e) => setOfferAmount(parseFloat(e.target.value))}
                placeholder="0.00"
                className="pl-7"
                required
              />
            </div>
            {offerAmount < listing.price * 0.7 && (
              <p className="text-xs text-yellow-600">
                Your offer is significantly lower than the asking price. The seller may be less likely to accept.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Seller (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you're interested in this item"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Offer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
