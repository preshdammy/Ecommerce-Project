import AccountLayout from '../../../../components/accounts/Accountlayout';
import AccountSettingsHeader from '../../../../components/accounts/AccountSettingHeader';
import BusinessInformationForm from '../../../../components/accounts/vendorBusinessinfoForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';


export default function BusinessInfoPage() {
  return (
    <AccountLayout>

      <div className=" flex items-center gap-2 mb-4 text-blue-600">
              <Link href="/vendor/account-settings" className="flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-base font-medium">Back</span>
              </Link>
            </div>

      <AccountSettingsHeader title="Business Information" />
      < BusinessInformationForm/>
    </AccountLayout>
  );
}
