import React, { useState } from 'react';
import { X, QrCode, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const handleStartScan = () => {
    setScanning(true);
    // Simulate QR scan after 2 seconds
    setTimeout(() => {
      toast({
        title: "QR Code Scanned",
        description: "Event details loaded successfully",
      });
      setScanning(false);
      onScanSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Scan QR Code</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Scanner Area */}
          <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
            {scanning ? (
              <>
                <Camera className="h-32 w-32 text-primary animate-pulse" />
                <p className="text-center text-muted-foreground mt-4">
                  Scanning QR code...
                </p>
              </>
            ) : (
              <>
                <QrCode className="h-32 w-32 text-muted-foreground" />
                <p className="text-center text-muted-foreground mt-4">
                  Position the QR code within the frame
                </p>
              </>
            )}
          </div>

          <Button 
            onClick={handleStartScan} 
            className="w-full" 
            variant="hero"
            disabled={scanning}
          >
            {scanning ? 'Scanning...' : 'Start Camera'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Scan the QR code at your seat or event entrance
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QRScanner;
