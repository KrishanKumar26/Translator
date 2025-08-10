import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight, Copy, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

const Index = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: sourceText,
            source: sourceLang, // Explicitly specify the source language
            target: targetLang,
            format: "text",
          }),
        }
      );

      const data = await response.json();

      console.log("API Response:", data); // Log the response for debugging

      if (data && data.data && data.data.translations) {
        setTranslatedText(data.data.translations[0].translatedText);
        toast({
          title: "Translation completed!",
          description: "Your text has been translated successfully.",
        });
      } else if (data.error) {
        console.error("API Error:", data.error);
        toast({
          title: "Error",
          description: `API Error: ${data.error.message}`,
          variant: "destructive",
        });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast({
        title: "Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Language Translator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Translate text between languages instantly with our powerful translation tool
          </p>
        </div>

        {/* Main Translation Interface */}
        <div className="max-w-6xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
            <div className="p-8">
              {/* Language Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="h-12 bg-white/70 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapLanguages}
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">To</label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="h-12 bg-white/70 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Translation Text Areas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Text */}
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Enter text to translate..."
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      className="min-h-[200px] text-lg bg-white/70 border-gray-200 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      {sourceText && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(sourceText, sourceLang)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(sourceText)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{sourceText.length} characters</span>
                  </div>
                </div>

                {/* Translated Text */}
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Translation will appear here..."
                      value={translatedText}
                      readOnly
                      className="min-h-[200px] text-lg bg-gray-50/70 border-gray-200 resize-none"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      {translatedText && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(translatedText, targetLang)}
                            className="h-8 w-8 p-0 hover:bg-purple-100"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translatedText)}
                            className="h-8 w-8 p-0 hover:bg-purple-100"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{translatedText.length} characters</span>
                  </div>
                </div>
              </div>

              {/* Translate Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  className="px-12 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isTranslating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Translating...
                    </>
                  ) : (
                    'Translate'
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Instant Translation</h3>
              <p className="text-gray-600 text-sm">Get accurate translations between multiple languages in seconds</p>
            </Card>

            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Text-to-Speech</h3>
              <p className="text-gray-600 text-sm">Listen to the pronunciation of translated text</p>
            </Card>

            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Copy className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Easy Copy</h3>
              <p className="text-gray-600 text-sm">Copy translations to clipboard with one click</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
