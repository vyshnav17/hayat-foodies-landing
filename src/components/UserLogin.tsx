import { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

interface GoogleUser {
    email: string;
    name: string;
    picture: string;
    sub: string;
}

const UserLogin = () => {
    const [user, setUser] = useState<GoogleUser | null>(null);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('google_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const decoded: any = jwtDecode(credentialResponse.credential);
                const userData: GoogleUser = {
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture,
                    sub: decoded.sub,
                };

                setUser(userData);
                localStorage.setItem('google_user', JSON.stringify(userData));

                // Send user data to backend
                await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });

            } catch (error) {
                console.error('Login Failed:', error);
            }
        }
    };

    const handleLogout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('google_user');
    };

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.picture} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <div className="flex items-center">
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
                type="icon"
                shape="circle"
            />
        </div>
    );
};

export default UserLogin;
