
import BusinessInformationForm from '../../../../components/accounts/vendorBusinessinfoForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';


export default function BusinessInfoPage() {
  return (
    <>

      < BusinessInformationForm/>

       <div className="md:hidden flex justify-center mt-6 pb-4">
        <Link 
          href="/vendor/account-settings" 
          className="flex gap-2 px-4 py-2 items-center bg-gray-100 text-gray-700 rounded-lg font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Settings</span>
        </Link>
      </div>
      </>
  );
}
