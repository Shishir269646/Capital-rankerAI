"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { getMe, selectUser, selectToken, selectAuthLoading, selectAuthError } from '@/store/slices/authSlice';
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; // Assuming you have this component

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const user = useSelector(selectUser);
    const token = useSelector(selectToken);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    useEffect(() => {
        // Only fetch user if we don't have one and there's no ongoing process
        if (!user && !loading) {
            dispatch(getMe());
        }
    }, [dispatch, user, loading]);

    useEffect(() => {
        // Redirect if fetching user fails or if there's no user and no token after trying
        if (!loading && (error || (!user && !token))) {
            router.push('/login');
        }
    }, [loading, error, user, token, router]);

    // Show a global loader while we verify the user's session
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    
    // If user is authenticated, render the dashboard layout
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}