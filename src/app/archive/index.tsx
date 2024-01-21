import { Body, Composite, Engine } from "matter-js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { MarbleCanvas } from "./marble-canvas";
import { MarbleGrid } from "./marble-grid";
import { PreviewCard } from "./preview-card";
import { PreviewSummary } from "./preview-summary";

import { MarbleModal } from "@/components/app/archive/marble-modal";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { useApiMarbleCard } from "@/hooks/api/archive/useApiMarbleCard";
import { useApiMarbleList } from "@/hooks/api/archive/useApiMarbleList";
import { TArchiveView, TMarble, TRouteState } from "@/types/archive";
import { createMarbleObject } from "@/utils/createMarbleObject";

export const Archive = () => {
  const { state } = useLocation() as TRouteState;

  // NOTE: Server Data
  const { data: cardData } = useApiMarbleCard(state.postId);
  const { data: marbleData, refetch: refetchMarble } = useApiMarbleList(
    state.postId,
    {
      page: 0,
      size: 50,
    },
  );

  // NOTE: Marble List state
  const [marbleList, setMarbleList] = useState<TMarble[]>([]);
  const [isViewedIdList, setIsViewedIdList] = useState<number[]>([]);
  const [selectedMarbleId, setSelectedMarbleId] = useState<number>(-1);

  // NOTE: Marble Canvas state
  const [engine, setEngine] = useState<Matter.Engine>();
  const [marbleBodyList, setMarbleBodyList] = useState<Body[]>([]);

  // NOTE: Canvas, Grid View value
  const [view, setView] = useState<TArchiveView>("preview-card");

  // NOTE: Marble detail Open state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const createdEngine = Engine.create({
      timing: {
        timeScale: 0.8,
      },
    });
    setEngine(createdEngine);
  }, []);

  useEffect(() => {
    if (!marbleData?.pages.length) return;

    setMarbleList(marbleData?.pages.flatMap((page) => page.content));
  }, [marbleData]);

  useEffect(() => {
    if (!marbleList.length || !!marbleBodyList.length) return;

    const marbles = marbleList.map((marbleData) => {
      const { commentId, nickname } = marbleData;
      const isViewed =
        isViewedIdList.findIndex((marbleId) => marbleId === commentId) !== -1;

      return createMarbleObject({
        id: commentId,
        textContent: nickname,
        isViewed,
      });
    });
    setMarbleBodyList(marbles);
  }, [marbleList]);

  useEffect(() => {
    onChangeModalState(selectedMarbleId !== -1);
  }, [selectedMarbleId]);

  // NOTE: [DElETE] Delete marble on Canvas
  const onDeleteMarbleBody = (id: number) => {
    if (!engine) return;

    const deleteMarble = engine.world.bodies.find(
      ({ id, label }) => id === selectedMarbleId && label === "marble",
    );
    if (!deleteMarble) return;
    Composite.remove(engine.world, deleteMarble);
  };

  // NOTE: [MODAL CLOSE] Add marble on Canvas
  const onCloseModal = (lastMarbleId: number) => {
    if (!engine) return;

    const lastSelectedMarble = engine.world.bodies.find(
      ({ id, label }) => id === lastMarbleId && label === "marble",
    );
    if (!lastSelectedMarble) return;

    Composite.remove(engine.world, lastSelectedMarble);
    Composite.add(
      engine.world,
      createMarbleObject({
        id: lastSelectedMarble.id,
        textContent: lastSelectedMarble.render.text?.content || "",
        isViewed: true,
      }),
    );
    setSelectedMarbleId(-1);
  };

  // NOTE: [MODAL OPEN] Set selectedMarbleId (set Modal initial index)
  const onOpenModal = (id: number) => {
    setSelectedMarbleId(id);
  };

  const onChangeView = (view: TArchiveView) => {
    setView(view);
  };

  const onChangeModalState = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  const onChangeSelectedMarbleId = (id: number) => {
    setSelectedMarbleId(id);
  };

  const onUpdateMarbleList = async () => {
    await refetchMarble();
  };

  const onUpdateViewIdxList = (activeIdx: number) => {
    if (activeIdx === -1 || !marbleList.length) return;

    const activeMarbleId = marbleList[activeIdx].commentId;
    const updatedIsViewedIdxList = [
      ...new Set([...isViewedIdList, activeMarbleId]),
    ];
    setIsViewedIdList(updatedIsViewedIdxList);
  };

  // TODO: Marble 스와이프 후 삭제 시, 삭제된 구슬이 삭제되지 않는 이슈 (모달 진입한 구슬이 삭제)
  if (!marbleList.length) return null;
  return (
    <ConfirmDialog>
      {isModalOpen && Boolean(selectedMarbleId !== -1) && (
        <MarbleModal
          isOpen={isModalOpen}
          selectedMarbleId={selectedMarbleId}
          marbleList={marbleList}
          onCloseModal={onCloseModal}
          onUpdateMarbleList={onUpdateMarbleList}
          onUpdateViewIdxList={onUpdateViewIdxList}
        />
      )}

      {view === "preview-card" && cardData && (
        <PreviewCard cardData={cardData} onChangeView={onChangeView} />
      )}
      {view === "preview-summary" && (
        <PreviewSummary
          marbleNum={marbleList.length}
          onChangeView={onChangeView}
        />
      )}
      {view === "marble-canvas" && engine && (
        <MarbleCanvas
          engine={engine}
          marbleBodyList={marbleBodyList}
          selectedMarbleId={selectedMarbleId}
          isViewedIdList={isViewedIdList}
          onOpenModal={onOpenModal}
          onChangeView={onChangeView}
        />
      )}
      {view === "marble-grid" && (
        <MarbleGrid
          marbleList={marbleList}
          isViewedIdList={isViewedIdList}
          onChangeView={onChangeView}
          onChangeSelectedMarbleId={onChangeSelectedMarbleId}
        />
      )}
    </ConfirmDialog>
  );
};
