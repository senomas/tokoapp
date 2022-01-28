import { Auth, Typography, Button } from "@supabase/ui";
import { supabase } from "../api";
const { Text } = Typography

type Props = {
  supabaseClient: any
  children: any
}

const Profile: React.FC<Props> = ({ supabaseClient, children }) => {
  const { user } = Auth.useUser();
  if (user)
    return (
      <>
        <Text>Signed in: {user.email}</Text>
        <Button block onClick={() => supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  return children 
}

export default function AuthProfile() {
  return (
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Profile supabaseClient={supabase}>
          <Auth supabaseClient={supabase} />
        </Profile>
      </Auth.UserContextProvider>
  )
}