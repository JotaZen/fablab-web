import config from '@payload-config';
import '@payloadcms/next/css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import React from 'react';

interface Args {
    children: React.ReactNode;
    params: Promise<{
        segments: string[];
    }>;
}

const ServerFunctionLayout = async ({ children, params }: Args) => {
    const resolvedParams = await params;
    return (
        <RootLayout
            config={config}
            serverFunction={handleServerFunctions({ config, params: resolvedParams })}
        >
            {children}
        </RootLayout>
    );
};

export default ServerFunctionLayout;
