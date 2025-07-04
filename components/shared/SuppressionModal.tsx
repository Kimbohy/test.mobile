import { View, Text, TouchableOpacity } from "react-native";

interface SuppressionModalProps {
  productId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const SuppressionModal = ({
  productId,
  onConfirm,
  onCancel,
}: SuppressionModalProps) => {
  return (
    <View className="absolute inset-0 items-center justify-center bg-gray-800/50">
      <View className="w-11/12 max-w-md p-6 bg-white rounded-lg shadow-lg">
        <Text className="mb-4 text-lg font-semibold text-gray-900">
          Supprimer le produit
        </Text>
        <Text className="mb-6 text-gray-700">
          Êtes-vous sûr de vouloir supprimer ce produit ?
        </Text>
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onPress={onCancel}
          >
            <Text className="text-gray-800">Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-2 bg-red-600 rounded-lg"
            onPress={() => {
              onConfirm();
            }}
          >
            <Text className="text-white">Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SuppressionModal;
