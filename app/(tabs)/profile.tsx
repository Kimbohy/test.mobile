import React from "react";
import { ScrollView } from "react-native";

import { Text, View } from "@/components/Themed";
import ProfileInformation from "@/components/profile/ProfileInformation";
import ProfileActions from "@/components/profile/ProfileActions";
import { useAuthContext } from "@/context/AuthContext";
import { connectedUser } from "@/util/token";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useProfileEdit } from "@/hooks/profile/useProfileEdit";
import { useProfileActions } from "@/hooks/profile/useProfileActions";
import { profileUpdateSchema } from "@/schema/auth.schema";
import { PROFILE_CONSTANTS } from "@/constants/profile.constants";
import { User } from "@/types/user.type";

export default function ProfileScreen() {
  const { signOut, userToken, updateProfile } = useAuthContext();
  const user = userToken ? connectedUser(userToken) : null;

  const { validateField, validateForm, errors, clearErrors } =
    useFormValidation(profileUpdateSchema);

  const { handleSignOut } = useProfileActions(signOut);

  const publication: number = PROFILE_CONSTANTS.DEFAULT_PUBLICATION_COUNT;

  // Always call hooks - use user or fallback to handle the case when user is not available
  const fallbackUser: User = { id: "", name: "", email: "" };
  const currentUser = user || fallbackUser;
  const {
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
  } = useProfileEdit({
    user: currentUser,
    updateProfile,
    validateForm: user ? validateForm : () => true, // Skip validation when no real user
    clearErrors,
  });

  if (!user) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50 dark:bg-gray-900">
        <Text className="text-lg text-gray-600 dark:text-gray-400">
          No user logged in
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      {/* Main Profile Information */}
      <ProfileInformation user={user} publicationCount={publication} />

      {/* Secondary Actions - Only show for real users */}
      {user && (
        <ProfileActions
          onEditProfile={handleEditProfile}
          onSignOut={handleSignOut}
          isEditModalVisible={isEditModalVisible}
          isLoading={isLoading}
          editedName={editedName}
          editedEmail={editedEmail}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          errors={errors}
          onCloseModal={handleCloseModal}
          onSaveProfile={handleSaveProfile}
          onNameChange={setEditedName}
          onEmailChange={setEditedEmail}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          validateField={validateField}
        />
      )}
    </ScrollView>
  );
}
