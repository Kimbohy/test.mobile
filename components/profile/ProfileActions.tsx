import React from "react";
import { View } from "react-native";
import LoadingButton from "@/components/shared/LoadingButton";
import EditProfileModal from "./EditProfileModal";

interface ProfileActionsProps {
  onEditProfile: () => void;
  onSignOut: () => void;
  // Edit Modal Props
  isEditModalVisible: boolean;
  isLoading: boolean;
  editedName: string;
  editedEmail: string;
  newPassword: string;
  confirmPassword: string;
  errors: Record<string, string | null>;
  onCloseModal: () => void;
  onSaveProfile: () => void;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  validateField: (fieldName: any, value: any) => boolean;
}

export default function ProfileActions({
  onEditProfile,
  onSignOut,
  isEditModalVisible,
  isLoading,
  editedName,
  editedEmail,
  newPassword,
  confirmPassword,
  errors,
  onCloseModal,
  onSaveProfile,
  onNameChange,
  onEmailChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  validateField,
}: ProfileActionsProps) {
  return (
    <View className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <View className="gap-3">
        {/* Edit Profile Button */}
        <LoadingButton
          onPress={onEditProfile}
          title="Edit Profile"
          variant="primary"
          className="w-full"
        />

        {/* Sign Out Button */}
        <LoadingButton
          onPress={onSignOut}
          title="Sign Out"
          variant="danger"
          className="w-full"
        />
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isVisible={isEditModalVisible}
        isLoading={isLoading}
        editedName={editedName}
        editedEmail={editedEmail}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        errors={errors}
        onClose={onCloseModal}
        onSave={onSaveProfile}
        onNameChange={onNameChange}
        onEmailChange={onEmailChange}
        onNewPasswordChange={onNewPasswordChange}
        onConfirmPasswordChange={onConfirmPasswordChange}
        validateField={validateField}
      />
    </View>
  );
}
