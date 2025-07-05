import React from "react";
import { TouchableOpacity, Modal, Text, View } from "react-native";
import FormInput from "@/components/shared/FormInput";
import LoadingButton from "@/components/shared/LoadingButton";
import { PROFILE_CONSTANTS } from "@/constants/profile.constants";

interface EditProfileModalProps {
  isVisible: boolean;
  isLoading: boolean;
  editedName: string;
  editedEmail: string;
  newPassword: string;
  confirmPassword: string;
  errors: Record<string, string | null>;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  validateField: (fieldName: any, value: any) => boolean;
}

export default function EditProfileModal({
  isVisible,
  isLoading,
  editedName,
  editedEmail,
  newPassword,
  confirmPassword,
  errors,
  onClose,
  onSave,
  onNameChange,
  onEmailChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  validateField,
}: EditProfileModalProps) {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="items-center justify-center flex-1 dark:bg-gray-900 bg-gray-50">
        <View className="w-11/12 max-w-md p-6 m-4 bg-white rounded-lg dark:bg-gray-800">
          <Text className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </Text>

          {/* Name Input */}
          <FormInput
            label="Name"
            placeholder="Enter your name"
            value={editedName}
            onChangeText={onNameChange}
            containerClassName="mb-4"
            fieldName="name"
            validator={validateField}
            error={errors.name}
          />

          {/* Email Input */}
          <FormInput
            label="Email"
            placeholder="Enter your email"
            value={editedEmail}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            containerClassName="mb-4"
            fieldName="email"
            validator={validateField}
            error={errors.email}
          />

          {/* New Password Input */}
          <FormInput
            label="New Password (optional)"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={onNewPasswordChange}
            secureTextEntry
            containerClassName="mb-4"
            fieldName="newPassword"
            validator={validateField}
            error={errors.newPassword}
          />

          {/* Confirm Password Input */}
          {newPassword ? (
            <FormInput
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              secureTextEntry
              containerClassName="mb-6"
              fieldName="confirmPassword"
              validator={validateField}
              error={errors.confirmPassword}
            />
          ) : (
            <View className="mb-6" />
          )}

          {/* Action Buttons */}
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600"
              disabled={isLoading}
            >
              <Text className="text-gray-600 dark:text-gray-300">Cancel</Text>
            </TouchableOpacity>
            <LoadingButton
              onPress={onSave}
              title="Save"
              isLoading={isLoading}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
