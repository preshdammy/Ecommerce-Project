export default function AccountSettingsHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xl md:text-2xl sm:w-full md:w-full lg:hidden sm:font-bold md:font-bold bg-blue-500 text-white p-4 rounded text-center mx-auto">
      {title}
    </h2>
  );
}
