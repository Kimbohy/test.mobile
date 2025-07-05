import { useState } from "react";
import { Alert } from "react-native";
import { User } from "@/types/user.type";
import { PROFILE_CONSTANTS } from "@/constants/profile.constants";

interface UseProfileEditProps {
  user: User;
  updateProfile: (data: {
    name?: string;
    email?: string;
    password?: string;
  }) => Promise<boolean>;
  validateForm: (data: any) => boolean;
  clearErrors: () => void;
}

export function useProfileEdit({
  user,
  updateProfile,
  validateForm,
  clearErrors,
}: UseProfileEditProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have a real user (not the fallback)
  const hasRealUser = user && user.id && user.name && user.email;

  const handleEditProfile = () => {
    if (!hasRealUser) return; // Don't open modal if no real user
    
    setEditedName(user.name);
    setEditedEmail(user.email);
    setNewPassword("");
    setConfirmPassword("");
    clearErrors();
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!hasRealUser) return; // Don't proceed if no real user
    
    const formData = {
      name: editedName,
      email: editedEmail,
      newPassword: newPassword || undefined,
      confirmPassword: newPassword ? confirmPassword : undefined,
    };

    const isValid = validateForm(formData);

    if (!isValid) {
      Alert.alert(
        "Validation Error",
        PROFILE_CONSTANTS.FORM_VALIDATION_MESSAGES.VALIDATION_ERROR
      );
      return;
    }

    setIsLoading(true);

    const updateData: { name?: string; email?: string; password?: string } = {};

    if (editedName !== user.name) {
      updateData.name = editedName;
    }

    if (editedEmail !== user.email) {
      updateData.email = editedEmail;
    }

    if (newPassword) {
      updateData.password = newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      Alert.alert(
        "Info",
        PROFILE_CONSTANTS.FORM_VALIDATION_MESSAGES.NO_CHANGES
      );
      setIsLoading(false);
      setIsEditModalVisible(false);
      return;
    }

    const success = await updateProfile(updateData);
    setIsLoading(false);

    if (success) {
      setIsEditModalVisible(false);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
  };

  return {
    isEditModalVisible,
    editedName,
    editedEmail,
    newPassword,
    confirmPassword,
    isLoading,
    setEditedName,
    setEditedEmail,
    setNewPassword,
    setConfirmPassword,
    handleEditProfile,
    handleSaveProfile,
    handleCloseModal,
  };
}
