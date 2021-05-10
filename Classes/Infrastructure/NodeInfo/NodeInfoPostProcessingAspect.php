<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Infrastructure\NodeInfo;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;

/**
 * @Flow\Aspect
 */
final class NodeInfoPostProcessingAspect
{
    /**
     * @Flow\Around("method(Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper->renderNodeWithPropertiesAndChildrenInformation())")
     * @param JoinPointInterface $joinPoint
     * @return void
     */
    public function postProcessRenderNodeWithPropertiesAndChildrenInformation(
        JoinPointInterface $joinPoint
    ) {
        $node = $joinPoint->getMethodArgument('node');
        $nodeType = $node->getNodeType();
        $result = $joinPoint->getAdviceChain()->proceed($joinPoint);

        foreach ($result['properties'] ?? [] as $propertyName => &$convertedValue) {
            $editorName = $nodeType->getConfiguration(
                sprintf('properties.%s.ui.inspector.editor', $propertyName)
            );

            if ($editorName === 'Sitegeist.InspectorGadget/Inspector/Editor' && $node->getProperty($propertyName) instanceof \JsonSerializable) {
                $result['properties'][$propertyName] = $node->getProperty($propertyName);
            }
        }

        return $result;
    }
}