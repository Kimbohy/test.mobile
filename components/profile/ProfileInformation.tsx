import React from "react";
import { Text, View, Image } from "react-native";
import { User } from "@/types/user.type";

interface ProfileInformationProps {
  user: User;
  publicationCount: number;
}

export default function ProfileInformation({
  user,
  publicationCount,
}: ProfileInformationProps) {
  return (
    <View className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      {/* Profile Picture */}
      <View className="items-center mb-6">
        <View className="items-center justify-center w-24 h-24 mb-4 bg-gray-300 rounded-full dark:bg-gray-600">
          <Text className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {user.name}
        </Text>
      </View>

      {/* User Details */}
      <View className="gap-4">
        <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <Text className="font-medium text-gray-600 dark:text-gray-400">
            Email
          </Text>
          <Text className="text-gray-900 dark:text-white">{user.email}</Text>
        </View>

        <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <Text className="font-medium text-gray-600 dark:text-gray-400">
            Created Product
          </Text>
          <Text className="font-semibold text-gray-900 dark:text-white">
            {publicationCount}
          </Text>
        </View>

        <View className="flex-row items-center justify-between py-3">
          <Text className="font-medium text-gray-600 dark:text-gray-400">
            Status
          </Text>
          {/* This status indicator is to make the UI prettier XD */}
          <View className="flex-row items-center">
            {user ? (
              <>
                <View className="w-2 h-2 mr-2 bg-green-500 rounded-full" />
                <Text className="font-medium text-green-600 dark:text-green-400">
                  Active
                </Text>
              </>
            ) : (
              <>
                <View className="w-2 h-2 mr-2 bg-red-500 rounded-full" />
                <Text className="font-medium text-red-600 dark:text-red-400">
                  Inactive
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
