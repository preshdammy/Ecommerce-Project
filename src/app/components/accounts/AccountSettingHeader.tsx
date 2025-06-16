export default function AccountSettingsHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold bg-blue-500 text-white p-4 rounded text-center">
      {title}
    </h2>
  );
}
