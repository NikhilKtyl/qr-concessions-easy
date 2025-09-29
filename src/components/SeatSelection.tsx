import React, { useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { seatSections, seatRows } from '@/data/mockData';
import { SeatLocation } from '@/types';

interface SeatSelectionProps {
  onSubmit: (seat: SeatLocation) => void;
  onSkip: () => void;
  deliveryEnabled: boolean;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ onSubmit, onSkip, deliveryEnabled }) => {
  const [section, setSection] = useState('');
  const [row, setRow] = useState('');
  const [seat, setSeat] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryEnabled) {
      onSkip();
      return;
    }

    if (!section || !row || !seat) {
      setError('Please fill in all seat information');
      return;
    }

    // Simple validation - in a real app, this would check against actual seat map
    const seatNumber = parseInt(seat);
    if (isNaN(seatNumber) || seatNumber < 1 || seatNumber > 50) {
      setError('Invalid seat number. Please enter a number between 1 and 50');
      return;
    }

    onSubmit({ section, row, seat });
  };

  if (!deliveryEnabled) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm shadow-xl p-8">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Pickup Only</h2>
            <p className="text-muted-foreground mb-6">
              Your order will be ready for pickup at:
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="font-semibold text-foreground">Concessions Stand A</p>
              <p className="text-sm text-muted-foreground">North Gate Entrance</p>
            </div>
            <Button onClick={onSkip} variant="hero" size="lg" className="w-full">
              Continue to Menu
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm shadow-xl p-8">
        <div className="text-center mb-6">
          <MapPin className="h-12 w-12 text-secondary mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-foreground">Where are you sitting?</h2>
          <p className="text-muted-foreground mt-2">
            We'll deliver your order right to your seat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="section" className="text-base font-semibold">Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger id="section" className="h-12 text-base">
                <SelectValue placeholder="Select your section" />
              </SelectTrigger>
              <SelectContent>
                {seatSections.map((sec) => (
                  <SelectItem key={sec} value={sec} className="text-base py-3">
                    {sec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="row" className="text-base font-semibold">Row</Label>
            <Select value={row} onValueChange={setRow}>
              <SelectTrigger id="row" className="h-12 text-base">
                <SelectValue placeholder="Select your row" />
              </SelectTrigger>
              <SelectContent>
                {seatRows.map((r) => (
                  <SelectItem key={r} value={r} className="text-base py-3">
                    Row {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="seat" className="text-base font-semibold">Seat Number</Label>
            <Input
              id="seat"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter seat number (1-50)"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 pt-4">
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Confirm Seat & Continue
            </Button>
            <Button 
              type="button" 
              onClick={onSkip} 
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              Skip - I'll Pick Up Instead
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SeatSelection;