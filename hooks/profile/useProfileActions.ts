import { Alert } from "react-native";
import { PROFILE_CONSTANTS } from "@/constants/profile.constants";

export function useProfileActions(signOut: () => void) {
  const handleSignOut = () => {
    Alert.alert(
      PROFILE_CONSTANTS.SIGN_OUT_CONFIRMATION.TITLE,
      PROFILE_CONSTANTS.SIGN_OUT_CONFIRMATION.MESSAGE,
      [
        {
          text: PROFILE_CONSTANTS.SIGN_OUT_CONFIRMATION.CANCEL_TEXT,
          style: "cancel",
        },
        {
          text: PROFILE_CONSTANTS.SIGN_OUT_CONFIRMATION.CONFIRM_TEXT,
          style: "destructive",
          onPress: signOut,
        },
      ]
    );
  };

  return {
    handleSignOut,
  };
}
