import "../../styles/store/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { storeCoins, profileImage } from "../../assets";
import { useState, useEffect } from "react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useGetStoreItems } from "../../hooks/store/useGetStoreItems";
import { useGetOwnedFrames } from "../../hooks/store/useGetOwnedFrames";
import { useBuyStoreItem } from "../../hooks/store/useBuyStoreItem";
import { useEquipStoreItem } from "../../hooks/store/useEquipStoreItem";
import { useGetEquippedFrame } from "../../hooks/store/useGetEquippedFrame";
import Modal from "../../components/common/modal/Modal";
import Button from "../../components/common/button/Button";
import Avatar from "../../components/common/avatar/Avatar";
import { baseURL } from "../../constants/baseURL";
import { TailSpin } from "react-loader-spinner";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import AddFrameForm from "../../components/store/AddFrameForm";
import UpdateFrameForm from "../../components/store/UpdateFrameForm";
import { Pencil, Trash } from "lucide-react";
import DeleteFrameContent from "../../components/store/DeleteFrameContent";

interface StoreItem {
  id: string;
  name: string;
  price: number;
  URL: string;
  currency: string;
  canAfford: boolean;
}

interface OwnedFrame {
  id: string;
  name: string;
  URL: string;
}

const StorePage = () => {
  const { data: currentUser, isLoading: isUserLoading } = useGetCurrentUser();

  const [activeTab, setActiveTab] = useState<"Buy" | "Inventory">("Buy");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<StoreItem | null>(null);

  const getSortParam = () => {
    switch (sortOrder) {
      case "lowest":
        return "price";
      case "highest":
        return "-price";
      default:
        return "";
    }
  };

  const {
    data: storeData,
    isLoading: isStoreLoading,
    refetch: refetchStore,
  } = useGetStoreItems(getSortParam(), currentPage, limit);

  const {
    data: ownedData,
    isLoading: isOwnedLoading,
    refetch: refetchOwned,
  } = useGetOwnedFrames(getSortParam(), currentPage, limit);

  const {
    data: equippedFrameData,
    isLoading: isEquippedFrameLoading,
    refetch: refetchEquippedFrame,
  } = useGetEquippedFrame();

  const buyItemMutation = useBuyStoreItem();
  const equipItemMutation = useEquipStoreItem();

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, activeTab]);

  useEffect(() => {
    if (activeTab === "Buy") {
      refetchStore();
    } else {
      refetchOwned();
    }
  }, [currentPage, sortOrder, activeTab, refetchStore, refetchOwned]);

  const handlePageChange = (page: number) => {
    const totalPages =
      activeTab === "Buy"
        ? storeData?.pagination?.totalPages
        : ownedData?.pagination?.totalPages;

    if (page >= 1 && (totalPages ?? 0) >= page) {
      setCurrentPage(page);
    }
  };

  const handlePurchaseConfirm = async () => {
    if (!selectedFrame) return;

    try {
      await buyItemMutation.mutateAsync(selectedFrame);
      setIsPurchaseModalOpen(false);
      setSelectedFrame(null);

      if (isPreviewModalOpen) {
        setIsPreviewModalOpen(false);
        setPreviewItem(null);
      }

      refetchStore();
      refetchOwned();
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  const handleEquip = async (itemId: string) => {
    try {
      await equipItemMutation.mutateAsync(itemId);

      await Promise.all([refetchOwned(), refetchEquippedFrame()]);
    } catch (error) {
      console.error("Failed to equip frame:", error);
    }
  };

  const openPreview = (item: StoreItem) => {
    setPreviewItem(item);
    setIsPreviewModalOpen(true);
  };

  const proceedToPurchase = () => {
    if (!previewItem) return;
    setSelectedFrame(previewItem.id);
    setIsPreviewModalOpen(false);
    setIsPurchaseModalOpen(true);
  };

  const getCurrentItems = (): (StoreItem | OwnedFrame)[] => {
    if (activeTab === "Buy") {
      return storeData?.items || [];
    }
    return ownedData?.items || [];
  };

  const isLoading =
    activeTab === "Buy"
      ? isStoreLoading
      : isOwnedLoading || isEquippedFrameLoading;

  const getCurrentPagination = () => {
    if (activeTab === "Buy") {
      return storeData?.pagination;
    }
    return ownedData?.pagination;
  };

  const getSelectedItemDetails = (): StoreItem | OwnedFrame | undefined => {
    if (!selectedFrame) return undefined;
    return getCurrentItems().find((item) => item.id === selectedFrame);
  };

  const isStoreItem = (item: StoreItem | OwnedFrame): item is StoreItem => {
    return "price" in item && "canAfford" in item;
  };

  // add frame modal states
  const [isAddFrameModalOpen, setIsAddFrameModalOpen] = useState(false);

  // update frame modal states
  const [isUpdateFrameModalOpen, setIsUpdateFrameModalOpen] = useState(false);

  // delete frame modal states
  const [isDeleteFrameModalOpen, setIsDeleteFrameModalOpen] = useState(false);

  const [selectedFrameForCRUD, setSelectedFrameForCRUD] = useState<
    StoreItem | undefined
  >();

  return (
    <ProtectedRoute>
      <PageWrapper>
        <section className="store-main">
          {currentUser?.user.role === "admin" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // gap: "1rem",
                width: "250px",
                background: "var(--background)",
                borderRadius: "1rem",
                margin: "1rem auto 3rem",
              }}
            >
              <h3>Add Frame</h3>
              <button
                onClick={() => setIsAddFrameModalOpen(true)}
                className="add-content-btn"
              >
                +
              </button>
            </div>
          )}

          <div className="store-container">
            <div className="store-nav">
              <div className="coins-container">
                <img src={storeCoins} alt="coins" />
                {isUserLoading ? (
                  <TailSpin color="#4338ca" height={20} width={20} />
                ) : (
                  <p>
                    {currentUser?.user?.stats?.coins ??
                      currentUser?.user?.points ??
                      0}
                  </p>
                )}
              </div>
              <div
                className={`store-tab ${activeTab === "Buy" ? "active" : ""}`}
                onClick={() => setActiveTab("Buy")}
              >
                Store
              </div>
              <div
                className={`inventory-tab ${
                  activeTab === "Inventory" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Inventory")}
              >
                Inventory
              </div>
              <div className="store-filtering">
                <select
                  className="store-filtering-dropdown"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="lowest">Low to High</option>
                  <option value="highest">High to Low</option>
                </select>
              </div>
            </div>

            <div className="frames-container">
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "3rem",
                  }}
                >
                  <TailSpin color="#4338ca" height={80} width={80} />
                </div>
              ) : (
                <div className="store-frames">
                  {getCurrentItems().map((item) => (
                    <div
                      key={item.id}
                      className={`frame-card ${
                        isStoreItem(item) && !item.canAfford
                          ? "not-enough-coins"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredCardId(item.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      {currentUser?.user.role === "admin" && (
                        <span
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 50,
                            padding: "0.5rem",
                            cursor: "pointer",
                            background: "var(--primary)",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                          }}
                          onClick={() => {
                            // @ts-ignore
                            setSelectedFrameForCRUD(item);
                            setIsUpdateFrameModalOpen(true);
                          }}
                        >
                          <Pencil
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        </span>
                      )}

                      {currentUser?.user.role === "admin" && (
                        <span
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            padding: "0.5rem",
                            cursor: "pointer",
                            background: "var(--primary)",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                          }}
                          onClick={() => {
                            // @ts-ignore
                            setSelectedFrameForCRUD(item);
                            setIsDeleteFrameModalOpen(true);
                          }}
                        >
                          <Trash
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        </span>
                      )}

                      <div className="image-and-frame">
                        <Avatar
                          photo={
                            currentUser?.user?.photo
                              ? `${baseURL}/profilePics/${currentUser.user.photo}`
                              : profileImage
                          }
                          userFrame={item.URL}
                          animated={hoveredCardId === item.id}
                        />
                      </div>
                      <p className="frame-name">{item.name}</p>
                      {isStoreItem(item) && (
                        <p className="frame-price">{item.price}</p>
                      )}
                      {activeTab === "Buy" ? (
                        <button
                          onClick={() => isStoreItem(item) && openPreview(item)}
                          className="preview-button"
                          style={{
                            backgroundColor: "var(--primary)",
                            color: "white",
                          }}
                        >
                          Preview
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEquip(item.id)}
                          className={
                            item.id === equippedFrameData?.data?.id
                              ? "equipped"
                              : "equip-button"
                          }
                          disabled={item.id === equippedFrameData?.data?.id}
                        >
                          {item.id === equippedFrameData?.data?.id
                            ? "Equipped"
                            : "Equip"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading &&
                getCurrentPagination() &&
                (getCurrentPagination()?.totalPages ?? 0) > 1 && (
                  <div className="page-pagination">
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="previousPageArrow"
                      onClick={() => handlePageChange(currentPage - 1)}
                      style={{
                        cursor: currentPage > 1 ? "pointer" : "default",
                        opacity: currentPage > 1 ? 1 : 0.5,
                      }}
                    />

                    {Array.from(
                      {
                        length: Math.min(
                          5,
                          getCurrentPagination()?.totalPages ?? 0
                        ),
                      },
                      (_, i) => {
                        let pageNum;
                        const totalPages =
                          getCurrentPagination()?.totalPages ?? 0;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <a
                            key={pageNum}
                            href="#"
                            className={currentPage === pageNum ? "active" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                          >
                            {pageNum}
                          </a>
                        );
                      }
                    )}

                    {(getCurrentPagination()?.totalPages ?? 0) > 5 &&
                      currentPage <
                        (getCurrentPagination()?.totalPages ?? 0) - 2 && (
                        <>
                          <span>...</span>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              const totalPages =
                                getCurrentPagination()?.totalPages ?? 0;
                              handlePageChange(totalPages);
                            }}
                          >
                            {getCurrentPagination()?.totalPages}
                          </a>
                        </>
                      )}

                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="nextPageArrow"
                      onClick={() => handlePageChange(currentPage + 1)}
                      style={{
                        cursor:
                          currentPage <
                          (getCurrentPagination()?.totalPages ?? 0)
                            ? "pointer"
                            : "default",
                        opacity:
                          currentPage <
                          (getCurrentPagination()?.totalPages ?? 0)
                            ? 1
                            : 0.5,
                      }}
                    />
                  </div>
                )}
            </div>
          </div>

          {/* Preview Modal */}
          <Modal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
          >
            {previewItem && (
              <div style={{ padding: "1rem", textAlign: "center" }}>
                <h2 style={{ marginBottom: "1rem" }}>{previewItem.name}</h2>

                <div className="frame-preview-avatar">
                  <Avatar
                    photo={
                      currentUser?.user?.photo
                        ? `${baseURL}/profilePics/${currentUser.user.photo}`
                        : profileImage
                    }
                    userFrame={previewItem.URL}
                    animated={true}
                    className="preview-avatar-image"
                  />
                </div>

                <p style={{ marginBottom: "1rem", fontSize: "18px" }}>
                  {previewItem.price} coins
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    gap: "1rem",
                    marginTop: "2rem",
                  }}
                >
                  <Button
                    onClick={() => setIsPreviewModalOpen(false)}
                    style={{ backgroundColor: "#ccc", color: "#333" }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={proceedToPurchase}
                    disabled={!previewItem.canAfford}
                    style={
                      !previewItem.canAfford
                        ? { backgroundColor: "#ccc", cursor: "not-allowed" }
                        : undefined
                    }
                  >
                    {previewItem.canAfford ? "Buy Now" : "Not Enough Coins"}
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Purchase Confirmation Modal */}
          <Modal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
          >
            <div style={{ padding: "1rem", textAlign: "center" }}>
              <h2 style={{ marginBottom: "1rem" }}>Confirm Purchase</h2>
              {(() => {
                const item = getSelectedItemDetails();
                return (
                  <p style={{ marginBottom: "2rem" }}>
                    Are you sure you want to purchase this frame?
                    {item && isStoreItem(item) && (
                      <span
                        style={{
                          display: "block",
                          fontWeight: "bold",
                          marginTop: "0.5rem",
                        }}
                      >
                        Cost: {item.price} coins
                      </span>
                    )}
                  </p>
                );
              })()}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "1rem",
                }}
              >
                <Button
                  onClick={() => setIsPurchaseModalOpen(false)}
                  style={{ backgroundColor: "#ccc", color: "#333" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchaseConfirm}
                  isLoading={buyItemMutation.isPending}
                >
                  Confirm Purchase
                </Button>
              </div>
            </div>
          </Modal>

          {/* create frame modal */}
          {currentUser?.user.role === "admin" && (
            <Modal
              isOpen={isAddFrameModalOpen}
              onClose={() => setIsAddFrameModalOpen(false)}
            >
              <AddFrameForm />
            </Modal>
          )}

          {/* update frame modal */}
          {currentUser?.user.role === "admin" && selectedFrameForCRUD && (
            <Modal
              isOpen={isUpdateFrameModalOpen}
              onClose={() => setIsUpdateFrameModalOpen(false)}
            >
              <UpdateFrameForm
                id={selectedFrameForCRUD?.id}
                URL={selectedFrameForCRUD?.URL}
                currency={selectedFrameForCRUD?.currency}
                name={selectedFrameForCRUD?.name}
                price={selectedFrameForCRUD?.price}
                canAfford={selectedFrameForCRUD.canAfford}
              />
            </Modal>
          )}

          {/* delete frame modal */}
          {currentUser?.user.role === "admin" && selectedFrameForCRUD && (
            <Modal
              isOpen={isDeleteFrameModalOpen}
              onClose={() => setIsDeleteFrameModalOpen(false)}
            >
              <DeleteFrameContent
                id={selectedFrameForCRUD?.id}
                URL={selectedFrameForCRUD?.URL}
                currency={selectedFrameForCRUD?.currency}
                name={selectedFrameForCRUD?.name}
                price={selectedFrameForCRUD?.price}
                canAfford={selectedFrameForCRUD.canAfford}
              />
            </Modal>
          )}
        </section>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default StorePage;
