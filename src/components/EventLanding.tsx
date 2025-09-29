import React from 'react';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { currentEvent } from '@/data/mockData';

interface EventLandingProps {
  onStartOrder: () => void;
}

const EventLanding: React.FC<EventLandingProps> = ({ onStartOrder }) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* School Logo Header */}
      <div className="bg-background/95 backdrop-blur-sm p-4 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-10 w-10 text-secondary" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Wilson High School</h1>
            <p className="text-sm text-muted-foreground">Go Warriors!</p>
          </div>
        </div>
      </div>

      {/* Event Info */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{currentEvent.name}</h2>
            <div className="flex flex-col gap-3 text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-lg">{currentEvent.date}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-lg">{currentEvent.time}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{currentEvent.venue}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
              <span className="font-semibold">Ordering Open</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onStartOrder}
            variant="hero"
            size="xl"
            className="w-full"
          >
            Start Order
          </Button>

          {/* Delivery Info */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-center text-sm text-muted-foreground">
              {currentEvent.deliveryEnabled 
                ? "✨ Delivery to your seat available!" 
                : `📍 Pickup at ${currentEvent.pickupLocation}`}
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-background/95 backdrop-blur-sm p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Skip the lines • Order from your seat • Pay with card or cash
        </p>
      </div>
    </div>
  );
};

export default EventLanding;