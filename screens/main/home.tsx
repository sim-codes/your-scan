import { SafeAreaView } from "@/components/common/view";
import { HeaderText, BodyText } from "@/components/common/text";

export default function MainScreen() {
    return (
        <SafeAreaView variant="screen" padding="sm">
            <HeaderText>Home Screen</HeaderText>
            <BodyText>
                Hello World
            </BodyText>
        </SafeAreaView>
    );
}
