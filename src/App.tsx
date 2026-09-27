import { useState, useCallback } from 'react';
import { useFamily } from './hooks/useFamily';
import { useShoppingList } from './hooks/useShoppingList';
import { useNotifications } from './hooks/useNotifications';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { UserSwitcherModal } from './components/layout/UserSwitcherModal';
import { AddItemModal } from './components/shopping/AddItemModal';
import { DashboardPage } from './pages/DashboardPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { Category } from './types/shopping';

export function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'shopping'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Hook da Família e Utilizador (Glaucia por defeito)
  const {
    family,
    members,
    currentUser,
    switchUser,
    getUserById,
  } = useFamily();

  // Hook da Lista de Compras
  const {
    items,
    filteredItems,
    stats,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterStatus,
    setFilterStatus,
    addItem,
    togglePurchased,
    updateItem,
    deleteItem,
    clearPurchased,
    resetToMockData,
  } = useShoppingList(family.id, currentUser.id);

  // Hook de Notificações Familiares (MVP)
  const { unviewedCount, markAsViewed } = useNotifications(
    currentUser.id,
    family.id,
    items
  );

  // Selecionar separador e limpar badge se for para a lista
  const handleSelectTab = useCallback(
    (tab: 'dashboard' | 'shopping') => {
      setCurrentTab(tab);
      if (tab === 'shopping') {
        markAsViewed();
      }
    },
    [markAsViewed]
  );

  // Navegar do Dashboard diretamente para a lista com filtros aplicados
  const handleNavigateToList = useCallback(
    (category?: Category, status?: 'pending' | 'purchased') => {
      if (category) {
        setSelectedCategory(category);
      }
      if (status) {
        setFilterStatus(status);
      }
      setCurrentTab('shopping');
      markAsViewed();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setSelectedCategory, setFilterStatus, markAsViewed]
  );

  const handleUpdateQuantity = useCallback(
    (id: string, newQuantity: number) => {
      updateItem(id, { quantity: newQuantity });
    },
    [updateItem]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Barra de Topo */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        family={family}
        members={members}
        onSelectUser={switchUser}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={resetToMockData}
        unviewedCount={unviewedCount}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-12">
        {currentTab === 'dashboard' ? (
          <DashboardPage
            stats={stats}
            items={items}
            getUserById={getUserById}
            onNavigateToList={handleNavigateToList}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            currentUserName={currentUser.name}
            unviewedCount={unviewedCount}
          />
        ) : (
          <ShoppingListPage
            items={items}
            filteredItems={filteredItems}
            stats={stats}
            getUserById={getUserById}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            onTogglePurchased={togglePurchased}
            onUpdateQuantity={handleUpdateQuantity}
            onDelete={deleteItem}
            onClearPurchased={clearPurchased}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onResetData={resetToMockData}
          />
        )}
      </main>

      {/* Barra de Navegação Inferior (Mobile) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        unviewedCount={unviewedCount}
      />

      {/* Modal de Adicionar Produto */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addItem}
        currentUserName={currentUser.name}
      />

      {/* Modal de Membros da Família */}
      <UserSwitcherModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        members={members}
        activeUserId={currentUser.id}
        onSelectUser={switchUser}
      />
    </div>
  );
}

export default App;
