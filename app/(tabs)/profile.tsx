import { TouchableOpacity, ScrollView } from "react-native";

import { Text, View } from "@/components/Themed";
import { useAuthContext } from "@/context/AuthContext";
import { connectedUser } from "@/util/token";

export default function ProfileScreen() {
  const { signOut, userToken } = useAuthContext();
  const user = userToken ? connectedUser(userToken) : null;
  console.log(user);

  const publication: number = 2;

  if (!user) {
    return;
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
            Profile
          </Text>
          <Text className="text-gray-600 dark:text-gray-300">
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View className="p-6 mb-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
          {/* Avatar Section */}
          <View className="items-center mb-6">
            <View className="items-center justify-center w-24 h-24 mb-4 bg-blue-600 rounded-full">
              <Text className="text-3xl font-bold text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              {user.name || "--"}
            </Text>
          </View>

          {/* User Info */}
          <View className="space-y-4">
            <View className="flex-row items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <View className="items-center justify-center w-10 h-10 mr-4 bg-blue-100 rounded-full dark:bg-blue-900">
                <Text className="text-lg text-blue-600 dark:text-blue-400">
                  @
                </Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  Email Address
                </Text>
                <Text className="font-medium text-gray-800 dark:text-white">
                  {user.email || "--"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <View className="items-center justify-center w-10 h-10 mr-4 bg-green-100 rounded-full dark:bg-green-900">
                <Text className="text-lg text-green-600 dark:text-green-400">
                  #
                </Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  Publications
                </Text>
                {publication > 0 ? (
                  <Text className="font-medium text-gray-800 dark:text-white">
                    {publication}{" "}
                    {publication === 1 ? "Publication" : "Publications"}
                  </Text>
                ) : (
                  <Text className="font-medium text-gray-500 dark:text-gray-400">
                    No Publications Yet
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={handleSignOut}
            className="px-6 py-4 text-white transition-transform bg-red-600 shadow-md hover:bg-red-700 rounded-xl active:scale-95"
          >
            <Text className="text-lg font-semibold text-center text-white">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
