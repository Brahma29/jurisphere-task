import { Calendar, FileText, Mail, MapPin, X } from "lucide-react";
import { TUser } from "../page";
import { formatDate } from "@/utils/functions";

type TUserInfoModalParams = {
  user: TUser;
  onClose: () => void;
};

export const UserInfoModal = ({ user, onClose }: TUserInfoModalParams) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="aspect-video w-2/6 bg-white rounded-3xl p-6 border shadow-lg">
        <div className="flex justify-between items-center mb-6">
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

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-900 font-medium">{user.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="text-gray-900 font-medium">
                {formatDate(user.joined_at)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText size={18} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-900 font-medium leading-relaxed">
                {user?.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
