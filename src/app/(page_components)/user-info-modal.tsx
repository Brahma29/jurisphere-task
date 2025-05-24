import { Calendar, FileText, Mail, MapPin, X, Copy } from "lucide-react";
import { TUser } from "@/types/user";
import { formatDate } from "@/utils/functions";
import { useState } from "react";

type TUserInfoModalParams = {
  user: TUser;
  onClose: () => void;
};

export const UserInfoModal = ({ user, onClose }: TUserInfoModalParams) => {
  const [copied, setCopied] = useState(false);

  console.log(user);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md md:w-2/6 md:max-w-none bg-white rounded-3xl p-4 md:p-6 border shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <p className="text-lg font-bold text-gray-900">
            {user.name || "User Name"}
          </p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-medium break-all">
                  {user.email}
                </p>
                <button
                  onClick={handleCopyEmail}
                  className="p-1 hover:bg-gray-100 rounded transition-colors group relative flex-shrink-0"
                  title="Copy email"
                >
                  <Copy
                    size={14}
                    className="text-gray-400 hover:text-gray-600"
                  />
                  {copied && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-900 font-medium break-words">
                {user.address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar
              size={18}
              className="text-gray-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="text-gray-900 font-medium">
                {formatDate(user.joined_at)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText
              size={18}
              className="text-gray-400 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-900 font-medium leading-relaxed break-words">
                {user?.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
