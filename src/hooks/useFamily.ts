import { useState, useEffect, useCallback } from 'react';
import { Family, User } from '../types/shopping';
import { shoppingService } from '../services';
import { INITIAL_CURRENT_USER_ID, INITIAL_USERS, INITIAL_FAMILY } from '../services/mockData';

const ACTIVE_USER_STORAGE_KEY = 'app_supermercado_active_user_id_v1';

export function useFamily() {
  const [family, setFamily] = useState<Family>(INITIAL_FAMILY);
  const [members, setMembers] = useState<User[]>(INITIAL_USERS);
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_USER_STORAGE_KEY) || INITIAL_CURRENT_USER_ID;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar família e utilizadores
  useEffect(() => {
    let isMounted = true;

    async function loadFamilyData() {
      try {
        const familyData = await shoppingService.getFamily(INITIAL_FAMILY.id);
        const familyMembers = await shoppingService.getFamilyUsers(INITIAL_FAMILY.id);

        if (isMounted) {
          if (familyData) setFamily(familyData);
          if (familyMembers.length > 0) setMembers(familyMembers);
        }
      } catch (err) {
        console.error('Erro ao carregar dados da família:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFamilyData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Alterar utilizador ativo (Glaucia por defeito)
  const switchUser = useCallback((userId: string) => {
    setActiveUserId(userId);
    try {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, userId);
    } catch (e) {
      console.error('Erro ao guardar utilizador ativo:', e);
    }
  }, []);

  // Utilizador atualmente ativo (Glaucia por defeito)
  const currentUser: User = members.find((m) => m.id === activeUserId) || members[0] || {
    id: INITIAL_CURRENT_USER_ID,
    familyId: INITIAL_FAMILY.id,
    name: 'Glaucia',
    avatarColor: '#2E7D32',
  };

  // Obter utilizador pelo ID
  const getUserById = useCallback(
    (userId: string | null): User | undefined => {
      if (!userId) return undefined;
      return members.find((m) => m.id === userId);
    },
    [members]
  );

  return {
    family,
    members,
    currentUser,
    activeUserId,
    switchUser,
    getUserById,
    isLoading,
  };
}
