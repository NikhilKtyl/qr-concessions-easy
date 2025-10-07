import React, { useState } from 'react';
import { X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthProps {
  onClose: () => void;
  onContinueAsGuest: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose, onContinueAsGuest }) => {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { toast } = useToast();

  const handleSendOTP = () => {
    if (phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    setStep('otp');
    toast({
      title: "OTP Sent",
      description: `Verification code sent to ${phone}`,
    });
  };

  const handleVerifyOTP = () => {
    if (otp === '1234') {
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      onClose();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP (1234 for demo)",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Login / Sign Up</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Method Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={method === 'phone' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setMethod('phone')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Phone
          </Button>
          <Button
            variant={method === 'email' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setMethod('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>

        {step === 'input' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">
                {method === 'phone' ? 'Phone Number' : 'Email Address'}
              </Label>
              <Input
                id="phone"
                type={method === 'phone' ? 'tel' : 'email'}
                placeholder={method === 'phone' ? '+1 (555) 000-0000' : 'you@example.com'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleSendOTP} className="w-full" variant="hero">
              Send OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="mt-1 text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Demo: Use 1234 as OTP
              </p>
            </div>
            <Button onClick={handleVerifyOTP} className="w-full" variant="hero">
              Verify & Login
            </Button>
            <Button 
              onClick={() => setStep('input')} 
              variant="ghost" 
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <Button 
            onClick={onContinueAsGuest} 
            variant="outline" 
            className="w-full"
          >
            Continue as Guest
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
