import { View, Text, TouchableOpacity, Modal, Pressable, useWindowDimensions, findNodeHandle, UIManager } from "react-native";
import tw from 'twrnc';
import Feather from '@expo/vector-icons/Feather';
import { useState, useRef, useEffect } from "react";
import { Display, SortOption, MeasureLayoutCallback, FilterSortViewProps } from "@/types/home";

export const FilterSortView = ({
    initialDisplay = "grid",
    initialSortOption = "most-recent",
    onDisplayChange,
    onSortChange,
    onAddPress,
    sortOptions = [
    { id: "most-recent", label: "Most Recent" },
    { id: "name", label: "Name" },
    { id: "date", label: "Date" }
    ]
}: FilterSortViewProps) => {
    const [display, setDisplay] = useState<Display>(initialDisplay);
    const [sortOption, setSortOption] = useState<SortOption>(initialSortOption);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const dimensions = useWindowDimensions();

    // Correctly type the ref
    const sortButtonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

    // Update local state if props change
    useEffect(() => {
        setDisplay(initialDisplay);
    }, [initialDisplay]);

    useEffect(() => {
        setSortOption(initialSortOption);
    }, [initialSortOption]);

    const toggleDisplay = (newDisplay: Display) => {
        setDisplay(newDisplay);
        if (onDisplayChange) {
            onDisplayChange(newDisplay);
        }
    };

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        if (onSortChange) {
            onSortChange(option);
        }
        setDropdownVisible(false);
    };

    const showDropdown = () => {
        if (sortButtonRef.current) {
            const node = findNodeHandle(sortButtonRef.current);
            if (node) {
                UIManager.measure(
                    node,
                    ((_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                        setDropdownPosition({
                            top: pageY + height + 4,
                            left: pageX
                        });
                        setDropdownVisible(true);
                    }) as MeasureLayoutCallback
                );
            }
        }
    };

    const handleAddPress = () => {
        if (onAddPress) {
            onAddPress();
        }
    };

    return (
        <View style={tw`flex-row gap-x-4 items-center justify-between border-b-2 border-[#80B2FF] pb-4`}>
            <View style={tw`flex-row gap-x-4 items-center`}>
                {/* Display toggle */}
                <View style={tw`flex-row items-center border border-[#AACCFF] rounded-md overflow-hidden`}>
                    <TouchableOpacity
                        onPress={() => toggleDisplay("grid")}
                        style={tw`p-2 flex-row gap-x-2 ${display === "grid" ? "bg-[#AACCFF]" : ""}`}
                    >
                        {display === "grid" && <Feather name="check" size={24} color="#0055D4" />}
                        <Feather name="grid" size={24} color="#0055D4" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => toggleDisplay("list")}
                        style={tw`p-2 flex-row gap-x-2 ${display === "list" ? "bg-[#AACCFF]" : ""}`}
                    >
                        {display === "list" && <Feather name="check" size={24} color="#0055D4" />}
                        <Feather name="menu" size={24} color="#0055D4" />
                    </TouchableOpacity>
                </View>

                {/* Sort dropdown */}
                <TouchableOpacity
                    ref={sortButtonRef}
                    onPress={showDropdown}
                    style={tw`p-2 flex-row gap-x-2 w-32 items-center justify-between border border-[#AACCFF] rounded-md`}
                >
                    <Text style={tw`text-[#0055D4]`}>
                        {sortOptions.find(option => option.id === sortOption)?.label}
                    </Text>
                    <Feather name="chevron-down" size={24} color="#0055D4" />
                </TouchableOpacity>
            </View>

            {/* Add button */}
            <TouchableOpacity
                style={tw`items-center justify-center bg-[#CCE0FF] rounded-full w-12 h-12 p-2`}
                onPress={handleAddPress}
            >
                <Feather name="plus" size={24} color="#0055D4" />
            </TouchableOpacity>

            {/* Dropdown modal */}
            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <Pressable
                    style={tw`flex-1 bg-black bg-opacity-20`}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View
                        style={[
                            tw`absolute bg-white rounded-md shadow-lg border border-[#AACCFF] overflow-hidden`,
                            { top: dropdownPosition.top, left: dropdownPosition.left }
                        ]}
                    >
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={tw`p-4 flex-row items-center gap-x-2 ${sortOption === option.id ? "bg-[#F0F7FF]" : ""}`}
                                onPress={() => handleSortChange(option.id)}
                            >
                                {sortOption === option.id && (
                                    <Feather name="check" size={18} color="#0055D4" />
                                )}
                                <Text style={tw`text-[#0055D4]`}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
