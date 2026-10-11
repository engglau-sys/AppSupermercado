import { useState, useEffect, useCallback } from 'react';
import { Family, User } from '../types/shopping';
import { shoppingService } from '../services';

export function useFamily() {
  const [family, setFamily] = useState<Family>({ id: '', name: 'Home' });
  const [members, setMembers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar família e utilizadores reais diretamente do Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadFamilyData() {
      try {
        setIsLoading(true);
        // Obter família ativa "Home" do Supabase
        const familyData = await shoppingService.getFamily('Home');

        if (familyData && isMounted) {
          setFamily(familyData);
          // Obter os utilizadores reais da tabela 'users' (id, name, avatar, color)
          const familyMembers = await shoppingService.getFamilyUsers(familyData.id);

          if (isMounted) {
            setMembers(familyMembers);
            if (familyMembers.length > 0) {
              setActiveUserId((prev) => {
                // Manter o utilizador ativo se já existir na lista, senão selecionar o primeiro
                const exists = familyMembers.some((m) => m.id === prev);
                return exists ? prev : familyMembers[0].id;
              });
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados da família no Supabase:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFamilyData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Alternar utilizador ativo (armazenado em memória, sem localStorage)
  const switchUser = useCallback((userId: string) => {
    setActiveUserId(userId);
  }, []);

  // Utilizador atualmente ativo
  const currentUser: User = members.find((m) => m.id === activeUserId) || members[0] || {
    id: activeUserId,
    familyId: family.id,
    name: 'Carregando...',
    avatar: 'U',
    color: 'green',
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
