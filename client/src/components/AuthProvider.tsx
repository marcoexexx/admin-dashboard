import { useMe, useStore } from "@/hooks";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { SuspenseLoader } from ".";

import AppError, { AppErrorKind } from "@/libs/exceptions";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const { dispatch } = useStore();
  const [cookies] = useCookies(["logged_in"]);

  const meQuery = useMe({
    enabled: !!cookies.logged_in,
    include: {
      cart: true,
    },
  });

  const me = meQuery.try_data.ok_or_throw();
  const { isSuccess, isLoading } = meQuery;

  useEffect(() => {
    if (isSuccess) dispatch({ type: "SET_USER", payload: me });
  }, [isSuccess]);

  const isAllowedReactDashboard = Boolean(
    me?.isSuperuser || me?.shopownerProviderId,
  );

  if (isLoading) return <SuspenseLoader />;

  if (cookies.logged_in && !isAllowedReactDashboard) {
    throw AppError.new(AppErrorKind.PermissionError);
  }

  return children;
}
