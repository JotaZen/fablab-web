import TestReservationsPage from '@/features/inventory/presentation/pages/test-reservations-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Test Reservations | FabLab Admin',
};

export default function Page() {
    return <TestReservationsPage />;
}
