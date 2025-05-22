
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit3, UploadCloud, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // Placeholder data - in a real app, this would come from state or API
  const username = "CreativeUser123";
  const rogeCoinBalance = 1250;
  const savedDesigns = [
    { id: 'design1', name: 'My Awesome T-Shirt', imageUrl: '/placeholder.svg', lastEdited: '2024-05-20' },
    { id: 'design2', name: 'Cool Hoodie Design', imageUrl: '/placeholder.svg', lastEdited: '2024-05-18' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
          <Button variant="outline" asChild>
            <Link to="/designer">
              <Edit3 className="mr-2 h-4 w-4" /> Create New Design
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information Section */}
          <div className="md:col-span-1 bg-card p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="gap-2">
                <UploadCloud className="h-4 w-4" />
                Change Picture
              </Button>
              <input type="file" className="hidden" accept="image/*" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-2">{username}</h2>
            <p className="text-muted-foreground text-center mb-6">Joined May 2024</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                <Input id="username" defaultValue={username} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <Input id="email" type="email" defaultValue="user@example.com" disabled />
              </div>
              <Button className="w-full">Update Profile</Button>
            </div>
          </div>

          {/* Roge Coin and Saved Designs Section */}
          <div className="md:col-span-2 space-y-8">
            {/* Roge Coin Balance */}
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Coins className="mr-2 h-5 w-5 text-primary" />
                Roge Coin Balance
              </h3>
              <p className="text-4xl font-bold text-primary">{rogeCoinBalance.toLocaleString()} RC</p>
              <p className="text-muted-foreground mt-2">Earn coins when others use your public designs!</p>
              <Button variant="link" className="px-0">Learn more about Roge Coins</Button>
            </div>

            {/* Saved Designs Section */}
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">My Saved Designs</h3>
              {savedDesigns.length > 0 ? (
                <div className="space-y-4">
                  {savedDesigns.map(design => (
                    <div key={design.id} className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={design.imageUrl} alt={design.name} className="w-16 h-16 rounded object-cover bg-muted" />
                        <div>
                          <p className="font-medium">{design.name}</p>
                          <p className="text-sm text-muted-foreground">Last edited: {design.lastEdited}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">You haven't saved any designs yet. <Link to="/designer" className="text-primary hover:underline">Start creating!</Link></p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
