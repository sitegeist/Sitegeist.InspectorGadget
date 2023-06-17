<?php

declare(strict_types=1);

namespace Sitegeist\InspectorGadget\Infrastructure\ContentRepository;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypePostprocessorInterface;

final class PropertyTypeForwarder implements NodeTypePostprocessorInterface
{
    /**
     * @param array<mixed> $configuration
     * @param array<mixed> $options
     */
    public function process(NodeType $nodeType, array &$configuration, array $options): void
    {
        if (isset($configuration['properties'])) {
            foreach ($configuration['properties'] as &$property) {
                if (isset($property['ui']['inspector']['editor']) && $property['ui']['inspector']['editor'] === 'Sitegeist.InspectorGadget/Inspector/Editor') {
                    $property['ui']['inspector']['editorOptions']['type'] = $property['type'];
                }
            }
        }
    }
}
