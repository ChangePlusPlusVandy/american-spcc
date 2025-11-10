import { UserProfile } from '@clerk/clerk-react';

export default function AccountPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <UserProfile
        appearance={{
          elements: {
            rootBox: 'shadow-xl rounded-2xl border border-gray-200 bg-white',
            card: 'p-6',
            navbar: 'hidden', // hides Clerk’s left sidebar if you want
          },
        }}
      />
    </div>
  );
}
