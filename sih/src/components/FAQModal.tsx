"use client";

import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FAQModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, toggleModal }) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Frequently Asked Questions</DialogTitle>
          <DialogDescription>Here are some common questions and answers...</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {/* Add more FAQ content here */}
        </div>
        <DialogClose asChild>
          <Button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default FAQModal;
