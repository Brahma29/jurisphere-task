export const TableHead = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <th
    className="text-left py-4 px-6 text-sm font-semibold text-gray-700 tracking-wide uppercase cursor-pointer hover:bg-gray-100 transition-colors duration-150"
    onClick={onClick}
  >
    <div className="flex justify-between items-center">{children}</div>
  </th>
);
